import { getJournalEntries } from "@/actions/journal";
import { getCollection } from "@/actions/collection";
import DeletCOllectionsDialog from "../components/DeleteCollections";
import Journalfilter from "../components/Journalfilter";

export default async function CollectionPage({ params }) {
  const { collectionid } = params;
  const collectionId = collectionid;

  const entries = await getJournalEntries({ collectionId });
  const collection = await getCollection(collectionId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold gradient-title">
            {collectionId === "unorganized"
              ? "Unorganized Entries"
              : collection?.name || "Collection"}
          </h1>
          {collection && (
            <DeletCOllectionsDialog
              collection={collection}
              entriesCount={entries.data.entries.length}
            />
          )}
        </div>
        {collection?.description && (
          <h2 className="font-extralight pl-1">{collection?.description}</h2>
        )}
      </div>

      {/* Client-side Filters Component */}
      <Journalfilter entries={entries.data.entries} />
    </div>
  );
}
