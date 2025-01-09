"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteJournalEntry } from "@/actions/journal";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

const DeleteDialog = ({ entryId }) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const {
    loading: isDeleting,
    fn: deleteEntryFn,
    data: deletedEntry,
  } = useFetch(deleteJournalEntry);

  useEffect(() => {
    if (deletedEntry && !isDeleting) {
      setDeleteDialogOpen(false);
      toast.error(`Journal entry deleted successfully`);
      router.push(
        `/collection/${
          deletedEntry.collectionId ? deletedEntry.collectionId : "unorganized"
        }`
      );
    }
  }, [deletedEntry, isDeleting]);

  const handleDelete = () => {
    deleteEntryFn(entryId);
  };

  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you Sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undo. This will permeanently delete your
            journal entry
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Entry"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
