export type ReferralStatus = "pending" | "approved" | "rejected" | "enrolled";
export interface Referral {
  id: string; referrerName: string; relationship: string;
  concern: string; details: string; status: ReferralStatus;
  createdAt: string; childName?: string; childAge?: number;
}
export type PillarProgress = "not_started" | "in_progress" | "progressing" | "completed";
export interface ChildProgress {
  christianLife: PillarProgress; education: PillarProgress;
  personalLife: PillarProgress; notes: string; lastUpdated: string;
}
export interface Child {
  id: string; name: string; age: number; gender: "male" | "female";
  community: string; enrolledDate: string; referralId: string;
  concern: string; status: "active" | "graduated" | "inactive";
  progress: ChildProgress;
}
export interface Report {
  id: string; childId: string; childName: string; date: string;
  title: string; christianLifeNote: string; educationNote: string;
  personalLifeNote: string; overallRating: 1 | 2 | 3 | 4 | 5; writtenBy: string;
}
