"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useModuleStore } from "@/stores/moduleStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { updateModuleRequest } from "@/requests/module/update";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function UpdateModuleForm() {
  const router = useRouter();
  const { id } = useParams();
  const moduleId = Number(id);

  const { selectedModule, getModuleById } = useModuleStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [learningBenefits, setLearningBenefits] = useState("<p>Memuat manfaat pembelajaran...</p>");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (moduleId) getModuleById(moduleId);
  }, [moduleId, getModuleById]);

  useEffect(() => {
    if (selectedModule) {
      setTitle(selectedModule.title);
      setThumbnail(selectedModule.thumbnail || "");
      setSummary(selectedModule.summary || "");
      setDescription(selectedModule.description || "");
      setLearningBenefits(
        selectedModule.learning_benefits
          ? JSON.parse(selectedModule.learning_benefits)
          : "<p>Belum ada manfaat pembelajaran</p>"
      );
      setCategoryId(String(selectedModule.category_id));
    }
  }, [selectedModule]);

  const handleSubmit = async () => {
    if (!moduleId || !categoryId) {
      toast.error("Semua field wajib diisi");
      return;
    }

    setLoading(true);

    const result = await updateModuleRequest({
      id: moduleId,
      title,
      thumbnail: thumbnail || null,
      summary: summary || null,
      description: description || null,
      learning_benefits: learningBenefits ? JSON.stringify(learningBenefits) : null,
      category_id: parseInt(categoryId),
    });

    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/module");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className="block text-sm font-medium mb-1">Judul Modul</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul modul" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
          <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="URL Gambar" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ringkasan</label>
          <Textarea
            className="w-full"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ringkasan modul"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <Textarea
            className="w-full"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi lengkap modul"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Manfaat Pembelajaran</label>
          <div className="border rounded" id="editor">
            <SimpleEditor value={learningBenefits} onChange={setLearningBenefits} />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}