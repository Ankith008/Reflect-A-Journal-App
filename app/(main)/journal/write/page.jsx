"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalScheme } from "@/app/lib/schema";
import { BarLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import CollectionFrom from "@/components/Collectionsdialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMoodById, MOODS } from "@/app/lib/moods";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import {
  createJournalEntry,
  getDraft,
  getJournalEntries,
  getJournalEntry,
  saveDraft,
  updateJournalEntry,
} from "@/actions/journal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCollection, getCollections } from "@/actions/collection";
import { useSearchParams } from "next/navigation";
import { isDirty } from "zod";
import { Loader2 } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const JournalEntryPage = () => {
  const [isCollectionDialogOpen, setIsCollectionsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    loading: entryLoading,
    data: existingEntry,
    fn: fetchEntry,
  } = useFetch(getJournalEntry);

  const {
    loading: draftLoading,
    data: draftData,
    fn: fetchDraft,
  } = useFetch(getDraft);

  const {
    loading: savingDraft,
    fn: saveDraftFn,
    data: savedDraft,
  } = useFetch(saveDraft);

  const {
    loading: actionLoading,
    fn: actionFn,
    data: actionResult,
  } = useFetch(isEditMode ? updateJournalEntry : createJournalEntry);

  const {
    fn: fetchCollection,
    data: collections,
    loading: collectionLoading,
  } = useFetch(getCollections);

  const {
    fn: createCollectionFn,
    data: createdCollection,
    loading: createCollectionLoading,
  } = useFetch(createCollection);

  useEffect(() => {
    if (actionResult && !actionLoading) {
      router.push(
        `/collection/${
          actionResult.collectionId ? actionResult.collectionId : "unorganized"
        }`
      );
      toast.success("Entry created successfully");
    }
  }, [actionResult, actionLoading]);

  const router = useRouter();

  useEffect(() => {
    fetchCollection();
    if (editId) {
      setIsEditMode(true);
      fetchEntry();
    } else {
      setIsEditMode(false);
      fetchDraft();
    }
  }, [editId]);

  useEffect(() => {
    if (isEditMode && existingEntry) {
      reset({
        title: existingEntry.title || "",
        content: existingEntry.content || "",
        mood: existingEntry.mood || "",
        collectionId: existingEntry.collectionId || "",
      });
    } else if (draftData?.success && draftData?.data) {
      reset({
        title: draftData.data.title || "",
        content: draftData.data.content || "",
        mood: draftData.data.mood || "",
        collectionId: "",
      });
    } else {
      reset({
        title: "",
        content: "",
        mood: "",
        collectionId: "",
      });
    }
  }, [draftData, isEditMode, existingEntry]);

  useEffect(() => {
    if (actionResult && !actionLoading) {
      if (!isEditMode) {
        saveDraftFn({ title: "", content: "", mood: "" });
      }

      router.push(
        `/collection/${
          actionResult.collectionId ? actionResult.collectionId : "unorganized"
        }`
      );

      toast.success(
        `Entry ${isEditMode ? "updated" : "created"} successfully!`
      );
    }
  }, [actionResult, actionLoading]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(journalScheme),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      collectionId: "",
    },
  });

  watch("mood");

  const onSubmit = handleSubmit(async (data) => {
    const mood = getMoodById(data.mood);
    actionFn({
      ...data,
      moodScore: mood.score,
      moodQuery: mood.pixabayQuery,
      ...(isEditMode && { id: editId }),
    });
  });

  useEffect(() => {
    if (createdCollection) {
      setIsCollectionsDialogOpen(false);
      fetchCollection();
      setValue("collectionId", createdCollection.id);
      toast.success(`Collection ${createdCollection.name} created`);
    }
  }, [createdCollection]);

  const handleCreateCollection = async (data) => {
    createCollectionFn(data);
  };

  const formData = watch();

  const handleSaveDraft = async () => {
    if (!isDirty) {
      toast.error("No changes to save");
      return;
    }
    await saveDraftFn(formData);
  };

  useEffect(() => {
    if (savedDraft?.success && !savingDraft) {
      toast.success("Draft saved successfully");
    }
  }, [savedDraft, savingDraft]);

  const isLoading =
    actionLoading ||
    collectionLoading ||
    entryLoading ||
    draftLoading ||
    savingDraft;
  return (
    <div className="py-8">
      <form className="space-y-2 mx-auto" onSubmit={onSubmit}>
        <h1 className="text-5xl md:text-6xl gradient-title">
          {isEditMode ? "Edit Entry" : "What's on Your mind?"}
        </h1>
        {isLoading && (
          <BarLoader color="orange" width={"100%"} className="mb-4" />
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            disabled={isLoading}
            {...register("title")}
            placeholder="Give your entry a title..."
            className={`py-5 md:text-md ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">How are you feeling?</label>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={errors.mood ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a mood..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MOODS).map((mood) => (
                    <SelectItem key={mood.id} value={mood.id}>
                      <span className="flex items-center gap-2">
                        {mood.emoji} {mood.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.mood && (
            <p className="text-red-500 text-sm">{errors.mood.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {getMoodById(getValues("mood"))?.prompt ?? "Write your thoughts..."}
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                readOnly={isLoading}
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            )}
          />

          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Add to Collection (Optional)
          </label>
          <Controller
            name="collectionId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  if (value === "new") {
                    setIsCollectionsDialogOpen(true);
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a collection..." />
                </SelectTrigger>
                <SelectContent>
                  {collections?.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    <span className="text-orange-600">
                      Create New Collection
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.collectionId && (
            <p className="text-red-500 text-sm">
              {errors.collectionId.message}
            </p>
          )}
        </div>
        <div className="space-x-4 flex">
          {!isEditMode && (
            <Button
              onClick={handleSaveDraft}
              type="button"
              variant="outline"
              disabled={savingDraft || !isDirty}
            >
              {savingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save as Draft
            </Button>
          )}{" "}
          <Button
            type="submit"
            variant="journal"
            disabled={actionLoading || !isDirty}
          >
            {isEditMode ? "Update" : "Publish"}
          </Button>
          {isEditMode && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.push(`/journal/${existingEntry.id}`);
              }}
              variant="destructive"
            >
              Cancel
            </Button>
          )}{" "}
        </div>
      </form>
      <CollectionFrom
        loading={createCollectionLoading}
        onSuccess={handleCreateCollection}
        open={isCollectionDialogOpen}
        setOpen={setIsCollectionsDialogOpen}
      />
    </div>
  );
};

export default JournalEntryPage;
