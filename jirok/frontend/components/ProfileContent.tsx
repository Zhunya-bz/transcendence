"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { updateUserProfile } from "@/actions/profile";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@/types/prisma";

interface ProfileContentProps {
  user?: User | null;
  editable?: boolean;
  onUpdated?: () => void;
  backHref?: string;
  backLabel?: string;
}

export function ProfileContent({
  user,
  editable = false,
  onUpdated,
  backHref,
  backLabel = "Back",
}: ProfileContentProps) {
  const [editingName, setEditingName] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobOrganization, setJobOrganization] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setSurname(user.surname ?? "");
      setJobTitle(user.jobTitle ?? "");
      setLocation(user.location ?? "");
      setJobOrganization(user.jobOrganization ?? "");
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      onUpdated?.();
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const canEdit = editable && Boolean(user?.id);

  const handleNameSave = () => {
    if (!user?.id) return;

    updateMutation.mutate(
      {
        id: user.id,
        data: { name, surname },
      },
      {
        onSuccess: () => {
          toast.success("Name updated");
          setEditingName(false);
        },
      }
    );
  };

  const handleNameCancel = () => {
    setName(user?.name ?? "");
    setSurname(user?.surname ?? "");
    setEditingName(false);
  };

  const handleAboutSave = () => {
    if (!user?.id) return;

    updateMutation.mutate(
      { id: user.id, data: { jobTitle, location, jobOrganization } },
      {
        onSuccess: () => {
          toast.success("About updated");
          setEditingAbout(false);
        },
      }
    );
  };

  const handleAboutCancel = () => {
    setJobTitle(user?.jobTitle ?? "");
    setLocation(user?.location ?? "");
    setJobOrganization(user?.jobOrganization ?? "");
    setEditingAbout(false);
  };

  const email = user?.email ?? "";
  const displayName = `${name} ${surname}`.trim() || "Your name";
  const avatarUrl = user?.avatarUrl ?? "";
  const isNameDirty =
    name !== (user?.name ?? "") || surname !== (user?.surname ?? "");
  const isAboutDirty =
    jobTitle !== (user?.jobTitle ?? "") ||
    location !== (user?.location ?? "") ||
    jobOrganization !== (user?.jobOrganization ?? "");

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 pt-2 pb-6">
        <div className="mb-5">
          {backHref ? (
            <Link
              href={backHref}
              className="mb-2 inline-flex text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              {backLabel}
            </Link>
          ) : null}
          <h1 className="text-2xl font-heading font-semibold text-blue-900">
            Profile
          </h1>
          <p className="text-base text-gray-500">Your personal details</p>
        </div>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-neutral-300 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <UserAvatar
                  size="lg"
                  className="size-16"
                  src={avatarUrl}
                  alt={displayName}
                />
                <div>
                  <p className="text-lg font-semibold text-blue-900">
                    {displayName}
                  </p>
                </div>
              </div>
              {canEdit && !editingName && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => setEditingName(true)}
                >
                  <Pencil />
                  Edit
                </Button>
              )}
            </div>

            {canEdit && editingName && (
              <div className="mt-4 grid gap-3">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-blue-700">Name</span>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200/60"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-blue-700">
                    Surname
                  </span>
                  <Input
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200/60"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="lg"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleNameSave}
                    disabled={!isNameDirty || updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={handleNameCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-neutral-300 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-blue-900">About</p>
                <p className="text-sm text-gray-500">Information about you</p>
              </div>
              {canEdit && !editingAbout && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => setEditingAbout(true)}
                >
                  <Pencil />
                  Edit
                </Button>
              )}
            </div>

            <div className="mt-4 grid gap-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-blue-700">Email</span>
                <Input
                  value={email}
                  disabled
                  className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200/60"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-blue-700">
                  Job title
                </span>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder=""
                  disabled={!editingAbout}
                  className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200/60"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-blue-700">
                  Organization
                </span>
                <Input
                  value={jobOrganization}
                  onChange={(e) => setJobOrganization(e.target.value)}
                  placeholder=""
                  disabled={!editingAbout}
                  className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200/60"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-blue-700">
                  Location
                </span>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder=""
                  disabled={!editingAbout}
                  className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200/60"
                />
              </label>
            </div>

            {canEdit && editingAbout && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleAboutSave}
                  disabled={!isAboutDirty || updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  onClick={handleAboutCancel}
                >
                  Cancel
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
