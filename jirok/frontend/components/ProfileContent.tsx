/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Camera, Pencil, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { updateUserAvatar, updateUserProfile } from "@/actions/profile";
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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

  const avatarMutation = useMutation({
    mutationFn: updateUserAvatar,
    onSuccess: () => {
      toast.success("Avatar updated");
      setAvatarFile(null);
      onUpdated?.();
    },
    onError: () => toast.error("Failed to update avatar"),
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
  const canUploadAvatar = Boolean(user?.id && avatarFile);

  const handleAvatarUpload = () => {
    if (!user?.id || !avatarFile) return;

    avatarMutation.mutate({ id: user.id, file: avatarFile });
  };

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 pt-2 pb-6">
        <div className="mb-5">
          {backHref ? (
            <Link
              href={backHref}
              className="mb-2 inline-flex text-sm font-medium text-primary hover:text-primary/80"
            >
              {backLabel}
            </Link>
          ) : null}
          <h1 className="text-2xl font-heading font-semibold text-foreground">
            Profile
          </h1>
          <p className="text-base text-muted-foreground">Your personal details</p>
        </div>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <UserAvatar
                  size="lg"
                  className="size-16"
                  src={avatarUrl}
                  alt={displayName}
                />
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {displayName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
            </div>

            {canEdit && (
              <div className="mt-4 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50">
                    <Camera className="size-4" />
                    Choose avatar
                    <Input
                      type="file"
                      onChange={(event) => {
                        setAvatarFile(event.target.files?.[0] ?? null);
                      }}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500">
                    {avatarFile ? avatarFile.name : "No file selected"}
                  </p>
                  <Button
                    size="lg"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleAvatarUpload}
                    disabled={!canUploadAvatar || avatarMutation.isPending}
                  >
                    <Upload />
                    {avatarMutation.isPending ? "Uploading..." : "Upload"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={() => setAvatarFile(null)}
                    disabled={!avatarFile || avatarMutation.isPending}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {canEdit && editingName && (
              <div className="mt-4 grid gap-3">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-foreground">Name</span>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-border bg-background focus-visible:border-ring focus-visible:ring-ring/30"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-foreground">
                    Surname
                  </span>
                  <Input
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="border-border bg-background focus-visible:border-ring focus-visible:ring-ring/30"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="lg"
                    className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                    onClick={handleNameSave}
                    disabled={!isNameDirty || updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-border text-foreground hover:bg-muted"
                    onClick={handleNameCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-foreground">About</p>
                <p className="text-sm text-muted-foreground">Information about you</p>
              </div>
              {canEdit && !editingAbout && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border text-foreground hover:bg-muted"
                  onClick={() => setEditingAbout(true)}
                >
                  <Pencil />
                  Edit
                </Button>
              )}
            </div>

            <div className="mt-4 grid gap-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-foreground">Email</span>
                <Input
                  value={email}
                  disabled
                  className="border-border bg-background focus-visible:border-ring focus-visible:ring-ring/30"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-foreground">
                  Job title
                </span>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder=""
                  disabled={!editingAbout}
                  className="border-border bg-background focus-visible:border-ring focus-visible:ring-ring/30"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-foreground">
                  Organization
                </span>
                <Input
                  value={jobOrganization}
                  onChange={(e) => setJobOrganization(e.target.value)}
                  placeholder=""
                  disabled={!editingAbout}
                  className="border-border bg-background focus-visible:border-ring focus-visible:ring-ring/30"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-foreground">
                  Location
                </span>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder=""
                  disabled={!editingAbout}
                  className="border-border bg-background focus-visible:border-ring focus-visible:ring-ring/30"
                />
              </label>
            </div>

            {canEdit && editingAbout && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                  onClick={handleAboutSave}
                  disabled={!isAboutDirty || updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border text-foreground hover:bg-muted"
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
