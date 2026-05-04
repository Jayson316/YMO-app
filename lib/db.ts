import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, where, writeBatch, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Referral, Child, Report, AttendanceRecord, AttendanceSession } from "@/types";

export async function addReferral(data: Omit<Referral, "id" | "status" | "createdAt">) {
  return addDoc(collection(db, "referrals"), { ...data, status: "pending", createdAt: new Date().toISOString() });
}
export async function getReferrals(): Promise<Referral[]> {
  const snap = await getDocs(query(collection(db, "referrals"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Referral));
}
export async function updateReferralStatus(id: string, status: Referral["status"]) {
  return updateDoc(doc(db, "referrals", id), { status });
}
export async function deleteReferral(id: string) { return deleteDoc(doc(db, "referrals", id)); }

export async function addChild(data: Omit<Child, "id">) {
  return addDoc(collection(db, "children"), data);
}
export async function getChildren(): Promise<Child[]> {
  const snap = await getDocs(query(collection(db, "children"), orderBy("enrolledDate", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Child));
}
export async function getChild(id: string): Promise<Child | null> {
  const snap = await getDoc(doc(db, "children", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Child;
}
export async function updateChild(id: string, data: Partial<Child>) {
  return updateDoc(doc(db, "children", id), data as Record<string, unknown>);
}
export async function deleteChild(id: string) { return deleteDoc(doc(db, "children", id)); }

export async function addReport(data: Omit<Report, "id">) {
  return addDoc(collection(db, "reports"), data);
}
export async function getReports(): Promise<Report[]> {
  const snap = await getDocs(query(collection(db, "reports"), orderBy("date", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Report));
}
export async function getChildReports(childId: string): Promise<Report[]> {
  const snap = await getDocs(query(collection(db, "reports"), where("childId", "==", childId), orderBy("date", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Report));
}
export async function deleteReport(id: string) { return deleteDoc(doc(db, "reports", id)); }

export async function saveAttendanceBatch(records: Omit<AttendanceRecord, "id" | "recordedAt">[]) {
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  records.forEach(r => {
    const id = `${r.date}_${r.childId}_${r.session || "default"}`;
    const ref = doc(db, "attendance", id);
    batch.set(ref, { ...r, recordedAt: now });
  });
  await batch.commit();
}

export async function getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
  const snap = await getDocs(query(collection(db, "attendance"), where("date", "==", date)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord));
}

export async function getAttendanceForChild(childId: string): Promise<AttendanceRecord[]> {
  const snap = await getDocs(query(collection(db, "attendance"), where("childId", "==", childId), orderBy("date", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord));
}

export async function getAllAttendance(): Promise<AttendanceRecord[]> {
  const snap = await getDocs(query(collection(db, "attendance"), orderBy("date", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord));
}

export async function deleteAttendance(id: string) {
  return deleteDoc(doc(db, "attendance", id));
}

export async function logAttendanceSession(data: Omit<AttendanceSession, "id" | "createdAt">) {
  return addDoc(collection(db, "attendanceSessions"), { ...data, createdAt: new Date().toISOString() });
}

export async function getAttendanceSessions(): Promise<AttendanceSession[]> {
  const snap = await getDocs(query(collection(db, "attendanceSessions"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceSession));
}
