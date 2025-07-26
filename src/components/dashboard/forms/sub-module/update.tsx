"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useSubModuleStore } from "@/stores/subModuleStore";
import { useModuleStore } from "@/stores/moduleStore";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { updateSubModuleRequest } from "@/requests/sub-module/update";

export default function UpdateSubModuleForm() {
  const router = useRouter();
  const { id } = useParams();
  const subModuleId = Number(id);

  const { selectedSubModule, getSubModuleById } = useSubModuleStore();
  const { modules, fetchModules } = useModuleStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<number>(1);
  const [objectives, setObjectives] = useState("<p></p>");
  const [requirements, setRequirements] = useState("<p></p>");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [moduleId, setModuleId] = useState("");
  const [learningResources, setLearningResources] = useState([{ label: "", url: "" }]);
  const [selfLearning, setSelfLearning] = useState([{ explanation: "", url: "" }]);
  const [material, setMaterial] = useState("<p></p>");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  useEffect(() => {
    if (subModuleId) getSubModuleById(subModuleId);
  }, [subModuleId, getSubModuleById]);

  useEffect(() => {
    if (selectedSubModule) {
      setTitle(selectedSubModule.title || "");
      setDescription(selectedSubModule.description || "");
      setDuration(selectedSubModule.duration_minutes || 1);
      setObjectives(selectedSubModule.objectives || "<p></p>");
      setRequirements(selectedSubModule.requirements || "<p></p>");
      setYoutubeUrl(selectedSubModule.youtube_url || "");
      setOrder(selectedSubModule.order || 1);
      setMaterial(selectedSubModule.sub_module_materials || "<p></p>");
      setModuleId(String(selectedSubModule.module_id) || "");
      setLearningResources(selectedSubModule.learning_resources || [{ label: "", url: "" }]);
      setSelfLearning(selectedSubModule.self_learning || [{ explanation: "", url: "" }]);
    }
  }, [selectedSubModule]);

  const updateLearningResource = (index: number, key: "label" | "url", value: string) => {
    const updated = [...learningResources];
    updated[index][key] = value;
    setLearningResources(updated);
  };

  const updateSelfLearning = (index: number, key: "explanation" | "url", value: string) => {
    const updated = [...selfLearning];
    updated[index][key] = value;
    setSelfLearning(updated);
  };

  const handleSubmit = async () => {
    if (!subModuleId || !moduleId) {
      toast.error("Semua field wajib diisi");
      return;
    }

    setLoading(true);
    const result = await updateSubModuleRequest({
      id: subModuleId,
      title,
      module_id: parseInt(moduleId),
      description,
      duration_minutes: duration,
      objectives,
      requirements,
      youtube_url: youtubeUrl || undefined,
      order,
      learning_resources: learningResources,
      self_learning: selfLearning,
      sub_module_materials: material,
    });

    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/sub-module");
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
          <label className="block text-sm font-medium mb-1">Judul Submodul</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul submodul" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Modul</label>
          <Select value={moduleId} onValueChange={setModuleId}>
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

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Durasi (menit)</label>
          <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Tujuan Pembelajaran</label>
          <div className="border rounded">
            <SimpleEditor value={objectives} onChange={setObjectives} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Persyaratan</label>
          <div className="border rounded">
            <SimpleEditor value={requirements} onChange={setRequirements} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL YouTube (opsional)</label>
          <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Urutan</label>
          <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Materi Submodul</label>
          <div className="border rounded">
            <SimpleEditor value={material} onChange={setMaterial} />
          </div>
        </div>

        {/* Learning Resources */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Sumber Belajar</label>
          {learningResources.map((res, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Label"
                value={res.label}
                onChange={(e) => updateLearningResource(index, "label", e.target.value)}
              />
              <Input
                placeholder="URL"
                value={res.url}
                onChange={(e) => updateLearningResource(index, "url", e.target.value)}
              />
              {learningResources.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    setLearningResources(learningResources.filter((_, i) => i !== index))
                  }
                >
                  <IconTrash className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={() => setLearningResources([...learningResources, { label: "", url: "" }])}>
            <IconPlus className="w-4 h-4 mr-1" /> Tambah Sumber
          </Button>
        </div>

        {/* Self Learning */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Self Learning</label>
          {selfLearning.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Penjelasan"
                value={item.explanation}
                onChange={(e) => updateSelfLearning(index, "explanation", e.target.value)}
              />
              <Input
                placeholder="URL"
                value={item.url}
                onChange={(e) => updateSelfLearning(index, "url", e.target.value)}
              />
              {selfLearning.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => setSelfLearning(selfLearning.filter((_, i) => i !== index))}
                >
                  <IconTrash className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={() => setSelfLearning([...selfLearning, { explanation: "", url: "" }])}>
            <IconPlus className="w-4 h-4 mr-1" /> Tambah Self Learning
          </Button>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}