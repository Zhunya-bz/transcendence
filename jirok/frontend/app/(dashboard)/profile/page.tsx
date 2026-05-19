"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentMe } from "@/actions/auth";
import { updateUserProfile } from "@/actions/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Pencil, Plus } from "lucide-react";
import toast from "react-hot-toast";

type TeamMember = {
  id: number;
  name: string;
  avatarUrl?: string | null;
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentMe,
  });

  const [editingName, setEditingName] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobOrganization, setJobOrganization] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newMember, setNewMember] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: "Iris Santos" },
    { id: 2, name: "Jonas Weber" },
    { id: 3, name: "Mina Park" },
  ]);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setSurname(user.surname ?? "");
      setJobTitle(user.jobTitle ?? "");
      setLocation(user.location ?? "");
      setJobOrganization(user.jobOrganization ?? "");
      setAvatarPreview(null);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleAvatarSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(
        typeof reader.result === "string" ? reader.result : null,
      );
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarSave = () => {
    if (!avatarPreview) return;
    updateMutation.mutate(
      { avatarUrl: avatarPreview },
      {
        onSuccess: () => {
          toast.success("Avatar updated");
          setAvatarPreview(null);
        },
      },
    );
  };

  const handleAvatarCancel = () => {
    setAvatarPreview(null);
  };

  const handleNameSave = () => {
    updateMutation.mutate(
      { name, surname },
      {
        onSuccess: () => {
          toast.success("Name updated");
          setEditingName(false);
        },
      },
    );
  };

  const handleNameCancel = () => {
    setName(user?.name ?? "");
    setSurname(user?.surname ?? "");
    setEditingName(false);
  };

  const handleAboutSave = () => {
    updateMutation.mutate(
      { jobTitle, location, jobOrganization },
      {
        onSuccess: () => {
          toast.success("About updated");
          setEditingAbout(false);
        },
      },
    );
  };

  const handleAboutCancel = () => {
    setJobTitle(user?.jobTitle ?? "");
    setLocation(user?.location ?? "");
    setJobOrganization(user?.jobOrganization ?? "");
    setEditingAbout(false);
  };

  const handleAddMember = () => {
    const trimmed = newMember.trim();
    if (!trimmed) return;

    setTeamMembers((prev) => [...prev, { id: Date.now(), name: trimmed }]);
    setNewMember("");
  };

  const email = user?.email ?? "";
  const displayName = `${name} ${surname}`.trim() || "Your name";
  const avatarUrl = avatarPreview ?? user?.avatarUrl ?? "";
  const avatarFallback = displayName.charAt(0).toUpperCase() || "U";
  const isNameDirty =
    name !== (user?.name ?? "") || surname !== (user?.surname ?? "");
  const isAboutDirty =
    jobTitle !== (user?.jobTitle ?? "") ||
    location !== (user?.location ?? "") ||
    jobOrganization !== (user?.jobOrganization ?? "");
  const isAvatarDirty = Boolean(avatarPreview);

  return (
    <div className="w-full min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-semibold text-blue-900">
            Profile
          </h1>
          <p className="text-base text-orange-700">
            Update your details and manage your team.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <section className="space-y-6">
            <div className="rounded-2xl border-2 border-blue-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar size="lg" className="size-16">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="text-base font-semibold">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold text-blue-900">
                      {displayName}
                    </p>
                    <p className="text-sm text-orange-600">
                      {email || "your@email.com"}
                    </p>
                  </div>
                </div>
                {!editingName && (
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

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleAvatarSelect(file);
                  }}
                />
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera />
                  Upload photo
                </Button>
                {isAvatarDirty && (
                  <>
                    <Button
                      size="lg"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleAvatarSave}
                      disabled={updateMutation.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                      onClick={handleAvatarCancel}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>

              {editingName && (
                <div className="mt-4 grid gap-3">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-blue-700">
                      Name
                    </span>
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
            </div>

            <div className="rounded-2xl border-2 border-orange-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-orange-700">Team</p>
                <span className="text-sm text-orange-600">
                  {teamMembers.length} people
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {teamMembers.map((member) => {
                  const initials = member.name
                    .split(" ")
                    .map((part) => part.charAt(0))
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar size="sm" className="size-7">
                        <AvatarImage
                          src={member.avatarUrl ?? ""}
                          alt={member.name}
                        />
                        <AvatarFallback className="text-xs">
                          {initials || "T"}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-base text-blue-900">{member.name}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Input
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Add teammate by name"
                  className="border-orange-200 focus-visible:border-orange-400 focus-visible:ring-orange-200/60"
                />
                <Button
                  size="lg"
                  className="bg-orange-500 text-white hover:bg-orange-600"
                  onClick={handleAddMember}
                  disabled={!newMember.trim()}
                >
                  <Plus />
                  Add people in project
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border-2 border-blue-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-blue-900">About</p>
                <p className="text-sm text-orange-600">
                  Work info shown on your profile.
                </p>
              </div>
              {!editingAbout && (
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

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-blue-700">
                  Job title
                </span>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Software Engineer"
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
                  placeholder="Paris, France"
                  disabled={!editingAbout}
                  className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200/60"
                />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-sm font-medium text-blue-700">
                  Organization
                </span>
                <Input
                  value={jobOrganization}
                  onChange={(e) => setJobOrganization(e.target.value)}
                  placeholder="Acme Corp"
                  disabled={!editingAbout}
                  className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200/60"
                />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-sm font-medium text-blue-700">Email</span>
                <Input
                  value={email}
                  disabled
                  className="border-blue-200 bg-blue-50 text-blue-700"
                />
                <span className="text-sm text-orange-600">
                  Email cannot be changed.
                </span>
              </label>
            </div>

            {editingAbout && (
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
