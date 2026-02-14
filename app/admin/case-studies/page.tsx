import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { getAllCaseStudies, deleteCaseStudy } from "@/app/actions/case-study-actions"

export default async function AdminCaseStudiesPage() {
  const caseStudies = await getAllCaseStudies()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Case Studies</h1>
          <p className="text-gray-600 mt-2">Manage your portfolio case studies</p>
        </div>
        <Button asChild>
          <Link href="/admin/case-studies/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Case Study
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((study) => (
          <Card key={study.id}>
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img
                src={study.image || "/placeholder.svg"}
                alt={study.imageAlt}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant={study.published ? "default" : "secondary"}>
                  {study.published ? "Published" : "Draft"}
                </Badge>
                <Badge variant="outline">{study.category}</Badge>
              </div>
              <CardTitle className="text-xl">{study.title}</CardTitle>
              <CardDescription>Client: {study.client}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{study.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                  <Link href={`/admin/case-studies/edit/${study.id}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server"
                    await deleteCaseStudy(study.id)
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    type="submit"
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {caseStudies.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No case studies yet</p>
          <Button asChild>
            <Link href="/admin/case-studies/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Case Study
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}
