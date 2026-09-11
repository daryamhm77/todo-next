import { redirect } from "next/navigation";
import ProfileForm from "@/module/ProfileForm";
import ProfileStats from "@/module/ProfileStats";
import { displayName } from "@/utils/names";
import { getProfileData } from "@/utils/user";

export default async function Profile() {
  const data = await getProfileData();
  if (!data) redirect("/");

  return (
    <div className="panel profile-page">
      <div className="profile-hero">
        <h2>Profile</h2>
        <p className="profile-name">{displayName(data)}</p>
        <p className="muted">{data.email}</p>
      </div>
      <ProfileStats stats={data.stats} />
      <h3 className="profile-section">Account</h3>
      <ProfileForm initialData={data} />
    </div>
  );
}
