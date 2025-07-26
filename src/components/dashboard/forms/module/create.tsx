"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createModuleRequest } from "@/requests/module/create";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCategoryStore } from "@/stores/categoryStore";

export default function CreateModuleForm() {
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(""); // string dulu, dikonversi saat submit
  const [thumbnail, setThumbnail] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [learningBenefits, setLearningBenefits] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async () => {
    setLoading(true);

    const result = await createModuleRequest({
      title,
      category_id: parseInt(categoryId), // convert string ke number
      thumbnail,
      summary: summary || null,
      description: description || null,
      learning_benefits: learningBenefits ? JSON.stringify(learningBenefits) : null,
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
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <Select value={categoryId} onValueChange={(val) => setCategoryId(val)}>
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

        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
          <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="URL Gambar" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ringkasan</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ringkasan modul"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi lengkap modul"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Manfaat Pembelajaran</label>
          <div className="border rounded" id="editor">
            <SimpleEditor value={learningBenefits} onChange={setLearningBenefits} />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Modul"}
        </Button>
      </form>
    </div>
  );
}
