"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubModuleStore } from "@/stores/subModuleStore";

export default function SubModuleDetailForm() {
  const { id } = useParams();
  const { selectedSubModule, getSubModuleById, loading } = useSubModuleStore();

  const [objectives, setObjectives] = useState("");
  const [requirements, setRequirements] = useState("");
  const [materials, setMaterials] = useState("");

  useEffect(() => {
    if (id) {
      getSubModuleById(Number(id));
    }
  }, [id, getSubModuleById]);

  useEffect(() => {
    if (selectedSubModule) {
      setObjectives(selectedSubModule.objectives || "");
      setRequirements(selectedSubModule.requirements || "");
      setMaterials(selectedSubModule.sub_module_materials || "");
    }
  }, [selectedSubModule]);

  if (loading || !selectedSubModule) {
    return <p>Memuat data...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Judul Modul</label>
        <Input value={selectedSubModule.module_title || "-"} readOnly />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Judul Sub Modul</label>
        <Input value={selectedSubModule.title || "-"} readOnly />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi</label>
        <Textarea value={selectedSubModule.description} rows={4} readOnly />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Durasi (menit)</label>
        <Input value={selectedSubModule.duration_minutes.toString()} readOnly />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <Input value={selectedSubModule.slug} readOnly />
      </div>

      {/* Objectives */}
      <div>
        <label className="block text-sm font-medium mb-1">Tujuan Pembelajaran</label>
        <div
          className="border rounded-md p-3 min-h-[150px] bg-white text-sm prose max-h-64 overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: objectives || "<p><em>Tidak ada tujuan pembelajaran</em></p>",
          }}
        />
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium mb-1">Persyaratan</label>
        <div
          className="border rounded-md p-3 min-h-[150px] bg-white text-sm prose max-h-64 overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: requirements || "<p><em>Tidak ada persyaratan</em></p>",
          }}
        />
      </div>

      {/* Sub Module Materials */}
      <div>
        <label className="block text-sm font-medium mb-1">Materi Submodul</label>
        <div
          className="border rounded-md p-3 min-h-[150px] bg-white text-sm prose max-h-64 overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: materials || "<p><em>Tidak ada materi</em></p>",
          }}
        />
      </div>

      {/* YouTube URL */}
      <div>
        <label className="block text-sm font-medium mb-1">URL YouTube</label>
        <Input value={selectedSubModule.youtube_url || "-"} readOnly />
      </div>

      {/* Learning Resources */}
      <div>
        <label className="block text-sm font-medium mb-1">Sumber Belajar</label>
        {selectedSubModule.learning_resources?.length ? (
          selectedSubModule.learning_resources.map((res, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <Input value={res.label} readOnly placeholder="Label" />
              <Input value={res.url} readOnly placeholder="URL" />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">Tidak ada sumber belajar</p>
        )}
      </div>

      {/* Self Learning */}
      <div>
        <label className="block text-sm font-medium mb-1">Self Learning</label>
        {selectedSubModule.self_learning?.length ? (
          selectedSubModule.self_learning.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <Input value={item.explanation} readOnly placeholder="Penjelasan" />
              <Input value={item.url} readOnly placeholder="URL" />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">Tidak ada data self learning</p>
        )}
      </div>

      {/* Order & Created At */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Urutan</label>
          <Input value={selectedSubModule.order.toString()} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Dibuat</label>
          <Input
            value={
              selectedSubModule.created_at
                ? new Date(selectedSubModule.created_at).toLocaleString("id-ID")
                : "-"
            }
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
