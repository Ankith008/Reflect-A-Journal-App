"use client";
import React, { useState, useEffect } from "react";
import CollectionsPreview from "./CollectionsPreview";
import CollectionFrom from "@/components/Collectionsdialog";
import useFetch from "@/hooks/useFetch";
import { createCollection, fetchCollection } from "@/actions/collection";
import { toast } from "sonner";

const Collections = ({ collections = [], entriesByCollection }) => {
  const [isCollectionsDialogOpen, setIsCollectionsDialogOpen] = useState(false);
  const {
    fn: createCollectionFn,
    data: createdCollection,
    loading: createCollectionLoading,
  } = useFetch(createCollection);

  useEffect(() => {
    if (createdCollection) {
      setIsCollectionsDialogOpen(false);
      toast.success(`Collection ${createdCollection.name} created`);
    }
  }, [createdCollection]);

  const handleCreateCollection = async (data) => {
    createCollectionFn(data);
  };

  return (
    <section id="collections" className="space-y-6">
      <h2 className="text-3xl font-bold gradient-title">Collections</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CollectionsPreview
          isCreateNew={true}
          onCreateNew={() => setIsCollectionsDialogOpen(true)}
        />
        {entriesByCollection?.unorganized?.length > 0 && (
          <CollectionsPreview
            name="Unorganized"
            entries={entriesByCollection.unorganized}
            isUnorganized={true}
          />
        )}
        {collections.map((collection) => (
          <CollectionsPreview
            key={collection.id}
            id={collection.id}
            name={collection.name}
            entries={entriesByCollection[collection.id] || []}
          />
        ))}
        <CollectionFrom
          loading={createCollectionLoading}
          onSuccess={handleCreateCollection}
          open={isCollectionsDialogOpen}
          setOpen={setIsCollectionsDialogOpen}
        />
      </div>
    </section>
  );
};

export default Collections;
