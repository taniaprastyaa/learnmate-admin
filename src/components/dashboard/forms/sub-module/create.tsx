"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { createSubModuleRequest } from "@/requests/sub-module/create";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useModuleStore } from "@/stores/moduleStore";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CreateSubModuleForm() {
  const router = useRouter();
  const { modules, fetchModules } = useModuleStore();

  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState(""); // ✅ NEW: Title field
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(5);
  const [objectives, setObjectives] = useState("");
  const [requirements, setRequirements] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [order, setOrder] = useState(1);

  const [learningResources, setLearningResources] = useState([{ label: "", url: "" }]);
  const [selfLearning, setSelfLearning] = useState([{ explanation: "", url: "" }]);
  const [materials, setMaterials] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleSubmit = async () => {
    setLoading(true);

    const result = await createSubModuleRequest({
      module_id: parseInt(moduleId),
      title, // ✅ NEW: Include title
      description,
      duration_minutes: duration,
      objectives,
      requirements,
      learning_resources: learningResources,
      self_learning: selfLearning,
      order,
      sub_module_materials: materials,
      youtube_url: youtubeUrl,
    });

    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/sub-module");
    } else {
      toast.error(result.message);
    }
  };

  const handleLearningResourceChange = (index: number, key: string, value: string) => {
    const updated = [...learningResources];
    updated[index][key as "label" | "url"] = value;
    setLearningResources(updated);
  };

  const handleSelfLearningChange = (index: number, key: string, value: string) => {
    const updated = [...selfLearning];
    updated[index][key as "explanation" | "url"] = value;
    setSelfLearning(updated);
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
        {/* Pilih Modul */}
        <div>
          <label className="block text-sm font-medium mb-1">Pilih Modul</label>
          <Select value={moduleId} onValueChange={(val) => setModuleId(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Modul" />
            </SelectTrigger>
            <SelectContent>
              {modules.map((mod) => (
                <SelectItem key={mod.id} value={String(mod.id)}>
                  {mod.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ✅ Input Judul Submodul */}
        <div>
          <label className="block text-sm font-medium mb-1">Judul Submodul</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul submodul"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Durasi */}
        <div>
          <label className="block text-sm font-medium mb-1">Durasi (menit)</label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        {/* Tujuan */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Tujuan</label>
          <div className="border rounded">
            <SimpleEditor value={objectives} onChange={setObjectives} />
          </div>
        </div>

        {/* Persyaratan */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Persyaratan</label>
          <div className="border rounded">
            <SimpleEditor value={requirements} onChange={setRequirements} />
          </div>
        </div>

        {/* Sumber Belajar */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Sumber Belajar</label>
          {learningResources.map((res, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Label"
                value={res.label}
                onChange={(e) => handleLearningResourceChange(index, "label", e.target.value)}
              />
              <Input
                placeholder="URL"
                value={res.url}
                onChange={(e) => handleLearningResourceChange(index, "url", e.target.value)}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() =>
                  setLearningResources((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <IconTrash className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => setLearningResources((prev) => [...prev, { label: "", url: "" }])}
          >
            <IconPlus className="w-4 h-4 mr-1" /> Tambah Sumber
          </Button>
        </div>

        {/* Self Learning */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Self Learning</label>
          {selfLearning.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Penjelasan"
                value={item.explanation}
                onChange={(e) => handleSelfLearningChange(index, "explanation", e.target.value)}
              />
              <Input
                placeholder="URL"
                value={item.url}
                onChange={(e) => handleSelfLearningChange(index, "url", e.target.value)}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() =>
                  setSelfLearning((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <IconTrash className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              setSelfLearning((prev) => [...prev, { explanation: "", url: "" }])
            }
          >
            <IconPlus className="w-4 h-4 mr-1" /> Tambah Self Learning
          </Button>
        </div>

        {/* Materi Submodul */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Materi Submodul</label>
          <div className="border rounded">
            <SimpleEditor value={materials} onChange={setMaterials} />
          </div>
        </div>

        {/* YouTube URL */}
        <div>
          <label className="block text-sm font-medium mb-1">URL YouTube</label>
          <Input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/..."
          />
        </div>

        {/* Urutan */}
        <div>
          <label className="block text-sm font-medium mb-1">Urutan</label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </div>

        {/* Submit */}
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Submodul"}
        </Button>
      </form>
    </div>
  );
}
