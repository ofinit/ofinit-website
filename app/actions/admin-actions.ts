"use server"

import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import {
  adminSessionCookieOptions,
  ADMIN_EMAIL_COOKIE,
  assertAdminAuthenticated,
  getAdminSessionEmail,
} from "@/lib/auth/admin-session"
import { isValidAdminEmail, normalizeAdminEmail } from "@/lib/auth/email"
import { MIN_ADMIN_PASSWORD_LENGTH } from "@/lib/auth/password"
import { prisma } from "@/lib/db/prisma"

export type AdminActionResult = { ok: true } | { ok: false; error: string }
export type ChangeAdminEmailResult = { ok: true; email: string } | { ok: false; error: string }

async function resolveAdminEmail(): Promise<string | null> {
  const sessionEmail = await getAdminSessionEmail()
  if (sessionEmail) return sessionEmail

  const users = await prisma.adminUser.findMany({
    select: { email: true },
    orderBy: { createdAt: "asc" },
  })
  if (users.length === 1) return users[0].email
  return null
}

export async function getAdminAccountInfo(): Promise<{ email: string } | null> {
  try {
    await assertAdminAuthenticated()
    const email = await resolveAdminEmail()
    return email ? { email } : null
  } catch {
    return null
  }
}

export async function changeAdminPassword(input: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<AdminActionResult> {
  try {
    await assertAdminAuthenticated()
  } catch {
    return { ok: false, error: "Your session expired. Sign in again." }
  }

  const email = await resolveAdminEmail()
  if (!email) {
    return { ok: false, error: "Sign out and sign in again, then retry changing your password." }
  }

  const currentPassword = input.currentPassword.trim()
  const newPassword = input.newPassword
  const confirmPassword = input.confirmPassword

  if (!currentPassword) {
    return { ok: false, error: "Enter your current password." }
  }

  if (newPassword.length < MIN_ADMIN_PASSWORD_LENGTH) {
    return { ok: false, error: `New password must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters.` }
  }

  if (newPassword !== confirmPassword) {
    return { ok: false, error: "New passwords do not match." }
  }

  if (currentPassword === newPassword) {
    return { ok: false, error: "New password must be different from the current password." }
  }

  try {
    const user = await prisma.adminUser.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return { ok: false, error: "Current password is incorrect." }
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash },
    })

    return { ok: true }
  } catch (e) {
    console.error("[changeAdminPassword]", e)
    return { ok: false, error: "Could not update password. Try again." }
  }
}

export async function changeAdminEmail(input: {
  newEmail: string
  confirmEmail: string
  currentPassword: string
}): Promise<ChangeAdminEmailResult> {
  try {
    await assertAdminAuthenticated()
  } catch {
    return { ok: false, error: "Your session expired. Sign in again." }
  }

  const currentEmail = await resolveAdminEmail()
  if (!currentEmail) {
    return { ok: false, error: "Sign out and sign in again, then retry changing your email." }
  }

  const newEmail = normalizeAdminEmail(input.newEmail)
  const confirmEmail = normalizeAdminEmail(input.confirmEmail)
  const currentPassword = input.currentPassword.trim()

  if (!currentPassword) {
    return { ok: false, error: "Enter your current password to confirm this change." }
  }

  if (!isValidAdminEmail(newEmail)) {
    return { ok: false, error: "Enter a valid email address." }
  }

  if (newEmail !== confirmEmail) {
    return { ok: false, error: "New email addresses do not match." }
  }

  if (newEmail === currentEmail) {
    return { ok: false, error: "New email is the same as your current login email." }
  }

  try {
    const user = await prisma.adminUser.findUnique({ where: { email: currentEmail } })
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return { ok: false, error: "Current password is incorrect." }
    }

    const taken = await prisma.adminUser.findUnique({ where: { email: newEmail } })
    if (taken) {
      return { ok: false, error: "That email is already in use by another admin account." }
    }

    await prisma.adminUser.update({
      where: { email: currentEmail },
      data: { email: newEmail },
    })

    // Keep password-reset tokens tied to the new address
    await prisma.adminPasswordResetToken.updateMany({
      where: { email: currentEmail },
      data: { email: newEmail },
    })

    const jar = await cookies()
    jar.set(ADMIN_EMAIL_COOKIE, newEmail, adminSessionCookieOptions())

    return { ok: true, email: newEmail }
  } catch (e) {
    console.error("[changeAdminEmail]", e)
    return { ok: false, error: "Could not update login email. Try again." }
  }
}
