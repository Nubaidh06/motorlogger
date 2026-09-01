import { db } from './config'
import {
  collection, addDoc, getDocs, getDoc,
  doc, updateDoc, deleteDoc, query, where, serverTimestamp,
} from 'firebase/firestore'

const COLLECTION = 'vehicles'

// add a new vehicle document to firestore
export async function addVehicle(userId, data) {
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  })
}

// get all vehicles belonging to the logged in user
export async function getVehicles(userId) {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

// get one vehicle by its document id
export async function getVehicle(vehicleId) {
  const ref = doc(db, COLLECTION, vehicleId)
  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

// update an existing vehicle
export async function updateVehicle(vehicleId, data) {
  return await updateDoc(doc(db, COLLECTION, vehicleId), data)
}

// delete a vehicle by id
export async function deleteVehicle(vehicleId) {
  return await deleteDoc(doc(db, COLLECTION, vehicleId))
}
