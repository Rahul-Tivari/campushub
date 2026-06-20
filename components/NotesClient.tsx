"use client";

import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface Props {
  initialNotes: Note[];
}

export default function NotesClient({
  initialNotes,
}: Props) {

  const [notes, setNotes] =
    useState(initialNotes);

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const handleCreate =
    async () => {

      const response =
        await fetch("/api/notes", {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title,
            content,
          }),

        });

      const note =
        await response.json();

      setNotes([
        note,
        ...notes,
      ]);

      setTitle("");
      setContent("");
    };

  const handleDelete =
    async (id: string) => {

      await fetch(
        `/api/notes/${id}`,
        {
          method: "DELETE",
        }
      );

      setNotes(
        notes.filter(
          (note) =>
            note.id !== id
        )
      );
    };

  return (

    <div className="grid gap-10 lg:grid-cols-3">

      {/* CREATE NOTE */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

        <h2 className="mb-6 text-3xl font-black">
          Create Note
        </h2>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
          />

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
            className="h-60 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none"
          />

          <button
            onClick={handleCreate}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 py-4 font-bold"
          >

            Save Note

          </button>

        </div>

      </div>

      {/* NOTES */}

      <div className="lg:col-span-2">

        <div className="grid gap-6 md:grid-cols-2">

          {notes.map((note) => (

            <div
              key={note.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >

              <div className="flex items-start justify-between">

                <h3 className="text-2xl font-bold">

                  {note.title}

                </h3>

                <button
                  onClick={() =>
                    handleDelete(
                      note.id
                    )
                  }
                  className="text-red-400"
                >

                  Delete

                </button>

              </div>

              <p className="mt-5 whitespace-pre-wrap leading-8 text-zinc-300">

                {note.content}

              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}