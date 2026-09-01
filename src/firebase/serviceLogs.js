import { db } from './config'
import {
  collection, addDoc, getDocs, getDoc,
  doc, updateDoc, deleteDoc, query, where, serverTimestamp,
} from 'firebase/firestore'

const COLLECTION = 'serviceLogs'

// add a log entry linked to a vehicle
export async function addLog(userId, vehicleId, data) {
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    userId,
    vehicleId,
    createdAt: serverTimestamp(),
  })
}

// get all logs for a specific vehicle
export async function getLogs(vehicleId) {
  const q = query(collection(db, COLLECTION), where('vehicleId', '==', vehicleId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

// get one log by id
export async function getLog(logId) {
  const snapshot = await getDoc(doc(db, COLLECTION, logId))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

// update a log
export async function updateLog(logId, data) {
  return await updateDoc(doc(db, COLLECTION, logId), data)
}

// delete a single log
export async function deleteLog(logId) {
  return await deleteDoc(doc(db, COLLECTION, logId))
}

// get all logs across all vehicles for a user - used on the dashboard
export async function getUserLogs(userId) {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

// delete all logs for a vehicle when the vehicle is deleted
export async function deleteLogsByVehicleId(vehicleId) {
  const q = query(collection(db, COLLECTION), where('vehicleId', '==', vehicleId))
  const snapshot = await getDocs(q)
  for (const d of snapshot.docs) {
    await deleteDoc(d.ref)
  }
}
