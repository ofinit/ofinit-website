import type React from "react"
import Link from "next/link"

export const dynamic = "force-dynamic"
import { LayoutDashboard, FileText, Settings, Briefcase, FolderTree, Receipt, LogOut, LayoutTemplate, Inbox, FileSignature, Wrench, MapPin } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
          <div className="p-6">
            {/* Updated logo to use image icon with OfinIT format */}
            <Link href="/admin" className="flex items-center text-xl font-bold">
              <span className="text-blue-600">{"<"}</span>
              <span className="text-foreground">OfinIT</span>
              <span className="text-blue-600">{"/>"}</span>
            </Link>
          </div>

          <nav className="px-4 space-y-2 flex-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/site"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LayoutTemplate className="w-5 h-5" />
              <span>Website</span>
            </Link>

            <Link
              href="/admin/pages"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FileSignature className="w-5 h-5" />
              <span>Pages</span>
            </Link>

            <Link
              href="/admin/locations"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span>SEO Locations</span>
            </Link>

            <Link
              href="/admin/services"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Wrench className="w-5 h-5" />
              <span>Services</span>
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Inbox className="w-5 h-5" />
              <span>Leads</span>
            </Link>

            <Link
              href="/admin/blogs"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Blog Posts</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FolderTree className="w-5 h-5" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/case-studies"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              <span>Case Studies</span>
            </Link>

            <Link
              href="/admin/invoices"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Receipt className="w-5 h-5" />
              <span>GST Invoices</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <a
              href="/api/auth/logout"
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </a>
            <Link href="/" className="block text-sm text-gray-600 hover:text-primary px-4 py-2 mt-2">
              ← Back to Website
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
