"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModuleStore } from "@/stores/moduleStore";

export default function ModuleDetailForm() {
  const { id } = useParams();
  const { selectedModule, getModuleById, loading } = useModuleStore();
  const [learningBenefits, setLearningBenefits] = useState("");

  useEffect(() => {
    if (id) {
      getModuleById(Number(id));
    }
  }, [id, getModuleById]);

  useEffect(() => {
    if (selectedModule?.learning_benefits) {
      try {
        const parsed = JSON.parse(selectedModule.learning_benefits);
        if (typeof parsed === "string") {
          setLearningBenefits(parsed);
        } else {
          setLearningBenefits(JSON.stringify(parsed, null, 2));
        }
      } catch (error) {
        console.error("Gagal parsing learning_benefits:", error);
        setLearningBenefits(selectedModule.learning_benefits);
      }
    } else {
      setLearningBenefits("");
    }
  }, [selectedModule]);

  if (loading || !selectedModule) {
    return <p>Memproses...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Judul Modul</label>
          <Input value={selectedModule.title} readOnly />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <Input value={selectedModule.category_name || "-"} readOnly />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <Input value={selectedModule.slug} readOnly />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail</label>
          <Input value={selectedModule.thumbnail || "-"} readOnly />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ringkasan</label>
        <Textarea value={selectedModule.summary || "-"} readOnly rows={3} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi</label>
        <Textarea value={selectedModule.description || "-"} readOnly rows={6} />
      </div>

      <div>
        <div className="block text-sm font-medium mb-1">Manfaat Pembelajaran</div>
        <div
          className="border rounded-md p-3 min-h-[150px] max-h-64 overflow-y-auto bg-white text-sm prose"
          dangerouslySetInnerHTML={{
            __html: learningBenefits || "<p><em>Tidak ada manfaat pembelajaran</em></p>",
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tanggal Dibuat</label>
        <Input
          value={
            selectedModule.created_at
              ? new Date(selectedModule.created_at).toLocaleString("id-ID")
              : "-"
          }
          readOnly
        />
      </div>
    </div>
  );
}