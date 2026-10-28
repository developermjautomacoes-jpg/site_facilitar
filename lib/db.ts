import fs from 'fs'
import crypto from 'crypto'
import { hashPassword } from './auth'
import { DATA_DIR, dataFile } from './paths'

// ─── JSON-based user storage (no native deps required) ────────────────

const USERS_FILE = dataFile('users.json')
const LEADS_FILE = dataFile('leads.json')
const NOTIFICATIONS_FILE = dataFile('notifications.json')

function ensureDataDir() {
  const dir = DATA_DIR
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// ─── Users ────────────────────────────────────────────────────────────

export interface UserData {
  id: number
  name: string
  email: string
  password?: string
  role: string
  company?: string
  whatsapp?: string
  active?: boolean
  created_at?: string
}

function initialAdminPassword(): string {
  const fromEnv = process.env.ADMIN_INITIAL_PASSWORD
  if (fromEnv) return fromEnv
  const generated = crypto.randomBytes(12).toString('base64url')
  console.warn(`[portal] Usuário admin criado com senha temporária: ${generated} — troque no primeiro acesso.`)
  return generated
}

function readUsers(): UserData[] {
  ensureDataDir()
  if (!fs.existsSync(USERS_FILE)) {
    // Seed with admin user
    const admin: UserData = {
      id: 1,
      name: 'Monique',
      email: 'monique@facilitar.net.br',
      password: hashPassword(initialAdminPassword()),
      role: 'admin',
      active: true,
      created_at: new Date().toISOString(),
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify([admin], null, 2), 'utf-8')
    return [admin]
  }

  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(raw) as UserData[]
  } catch {
    return []
  }
}

function writeUsers(users: UserData[]): void {
  ensureDataDir()
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

function nextUserId(users: UserData[]): number {
  if (users.length === 0) return 1
  return Math.max(...users.map((u) => u.id)) + 1
}

export function getUserByEmail(email: string): UserData | null {
  const users = readUsers()
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim())
  return found || null
}

export function getUserById(id: number): UserData | null {
  const users = readUsers()
  const found = users.find((u) => u.id === id)
  return found || null
}

export function createClient(data: Omit<UserData, 'id' | 'role'>): void {
  const users = readUsers()
  const newUser: UserData = {
    id: nextUserId(users),
    name: data.name,
    email: data.email.toLowerCase().trim(),
    password: data.password,
    role: 'client',
    company: data.company || undefined,
    whatsapp: data.whatsapp || undefined,
    active: true,
    created_at: new Date().toISOString(),
  }
  users.push(newUser)
  writeUsers(users)
}

export function listClients(): UserData[] {
  const users = readUsers()
  return users
    .filter((u) => u.role === 'client')
    .map(({ password, ...rest }) => rest as UserData)
    .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
}

export function deleteUser(id: number): void {
  let users = readUsers()
  users = users.filter((u) => !(u.id === id && u.role === 'client'))
  writeUsers(users)
}

// Update a client's data (admin function)
export function updateClient(id: number, data: Partial<Pick<UserData, 'name' | 'email' | 'company' | 'whatsapp' | 'password' | 'active'>>): UserData | null {
  const users = readUsers()
  const index = users.findIndex((u) => u.id === id && u.role === 'client')
  if (index === -1) return null

  if (data.name !== undefined) users[index].name = data.name
  if (data.email !== undefined) users[index].email = data.email.toLowerCase().trim()
  if (data.company !== undefined) users[index].company = data.company || undefined
  if (data.whatsapp !== undefined) users[index].whatsapp = data.whatsapp || undefined
  if (data.password !== undefined) users[index].password = data.password
  if (data.active !== undefined) users[index].active = data.active

  writeUsers(users)
  const { password, ...rest } = users[index]
  return rest as UserData
}

// Toggle client active status
export function toggleClientActive(id: number, active: boolean): UserData | null {
  const users = readUsers()
  const index = users.findIndex((u) => u.id === id && u.role === 'client')
  if (index === -1) return null

  users[index].active = active
  writeUsers(users)
  const { password, ...rest } = users[index]
  return rest as UserData
}

// Update client's own password
export function updateClientPassword(email: string, newPasswordHash: string): boolean {
  const users = readUsers()
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.role === 'client')
  if (index === -1) return false

  users[index].password = newPasswordHash
  writeUsers(users)
  return true
}

// ─── Leads ────────────────────────────────────────────────────────────

export interface LeadData {
  nome: string
  empresa?: string
  email: string
  whatsapp: string
  assunto: string
  mensagem: string
  ip?: string
}

export interface LeadRow extends LeadData {
  id: number
  created_at: string
}

function readLeads(): LeadRow[] {
  ensureDataDir()
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, '[]', 'utf-8')
    return []
  }

  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8')
    return JSON.parse(raw) as LeadRow[]
  } catch {
    return []
  }
}

function writeLeads(leads: LeadRow[]): void {
  ensureDataDir()
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8')
}

export function saveLead(data: LeadData): void {
  const leads = readLeads()
  const newLead: LeadRow = {
    id: leads.length > 0 ? Math.max(...leads.map((l) => l.id)) + 1 : 1,
    ...data,
    created_at: new Date().toISOString(),
  }
  leads.push(newLead)
  writeLeads(leads)
}

export function listLeads(): LeadRow[] {
  return readLeads().sort((a, b) => b.created_at.localeCompare(a.created_at))
}

// ─── Notifications ───────────────────────────────────────────────────

export interface NotificationData {
  id: number
  type: 'password_reset' | 'general'
  clientEmail: string
  clientName: string
  message: string
  read: boolean
  resolved: boolean
  created_at: string
}

function readNotifications(): NotificationData[] {
  ensureDataDir()
  if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    fs.writeFileSync(NOTIFICATIONS_FILE, '[]', 'utf-8')
    return []
  }
  try {
    const raw = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8')
    return JSON.parse(raw) as NotificationData[]
  } catch {
    return []
  }
}

function writeNotifications(notifications: NotificationData[]): void {
  ensureDataDir()
  fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2), 'utf-8')
}

export function createNotification(data: Omit<NotificationData, 'id' | 'read' | 'resolved' | 'created_at'>): void {
  const notifications = readNotifications()
  const newNotification: NotificationData = {
    id: notifications.length > 0 ? Math.max(...notifications.map((n) => n.id)) + 1 : 1,
    ...data,
    read: false,
    resolved: false,
    created_at: new Date().toISOString(),
  }
  notifications.push(newNotification)
  writeNotifications(notifications)
}

export function listNotifications(): NotificationData[] {
  return readNotifications().sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function markNotificationResolved(id: number): boolean {
  const notifications = readNotifications()
  const index = notifications.findIndex((n) => n.id === id)
  if (index === -1) return false
  notifications[index].resolved = true
  notifications[index].read = true
  writeNotifications(notifications)
  return true
}

export function countUnreadNotifications(): number {
  return readNotifications().filter((n) => !n.read).length
}

export function markNotificationRead(id: number): boolean {
  const notifications = readNotifications()
  const index = notifications.findIndex((n) => n.id === id)
  if (index === -1) return false
  notifications[index].read = true
  writeNotifications(notifications)
  return true
}

// ─── EAD Database ────────────────────────────────────────────────────

const EAD_MODULES_FILE = dataFile('ead_modules.json')
const EAD_PROGRESS_FILE = dataFile('ead_progress.json')
const EAD_CHAT_FILE = dataFile('ead_chat.json')

export interface EadSlide {
  title: string
  content: string
  bgGradient?: string
}

export interface EadLesson {
  id: string
  title: string
  description: string
  type: 'video' | 'pdf' | 'ppt'
  url: string // File path or external URL
  duration: string // e.g. "15 min"
  order: number
  slides?: EadSlide[] // Slides if created on presentation builder
}

export interface EadModule {
  id: number
  title: string
  description: string
  lessons: EadLesson[]
  created_at: string
}

export interface EadProgress {
  userEmail: string
  completedLessons: string[] // formatted as `${moduleId}-${lessonId}`
}

export interface EadChatMessage {
  id: number
  moduleId: number
  lessonId: string
  userEmail: string
  userName: string
  userRole: 'admin' | 'client'
  message: string
  created_at: string
  replies?: Array<{
    userName: string
    userRole: 'admin' | 'client'
    message: string
    created_at: string
  }>
}

function readEadModules(): EadModule[] {
  ensureDataDir()
  if (!fs.existsSync(EAD_MODULES_FILE)) {
    fs.writeFileSync(EAD_MODULES_FILE, '[]', 'utf-8')
    return []
  }
  try {
    const raw = fs.readFileSync(EAD_MODULES_FILE, 'utf-8')
    return JSON.parse(raw) as EadModule[]
  } catch {
    return []
  }
}

function writeEadModules(modules: EadModule[]): void {
  ensureDataDir()
  fs.writeFileSync(EAD_MODULES_FILE, JSON.stringify(modules, null, 2), 'utf-8')
}

// Module CRUD
export function listEadModules(): EadModule[] {
  return readEadModules().sort((a, b) => a.created_at.localeCompare(b.created_at))
}

export function getEadModuleById(id: number): EadModule | null {
  const modules = readEadModules()
  return modules.find((m) => m.id === id) || null
}

export function createEadModule(title: string, description: string): EadModule {
  const modules = readEadModules()
  const newModule: EadModule = {
    id: modules.length > 0 ? Math.max(...modules.map((m) => m.id)) + 1 : 1,
    title,
    description,
    lessons: [],
    created_at: new Date().toISOString(),
  }
  modules.push(newModule)
  writeEadModules(modules)
  return newModule
}

export function updateEadModule(id: number, title: string, description: string): EadModule | null {
  const modules = readEadModules()
  const index = modules.findIndex((m) => m.id === id)
  if (index === -1) return null
  modules[index].title = title
  modules[index].description = description
  writeEadModules(modules)
  return modules[index]
}

export function deleteEadModule(id: number): boolean {
  const modules = readEadModules()
  const filtered = modules.filter((m) => m.id !== id)
  if (filtered.length === modules.length) return false
  writeEadModules(filtered)
  return true
}

// Lesson CRUD inside Module
export function addEadLesson(moduleId: number, lesson: Omit<EadLesson, 'id'>): EadLesson | null {
  const modules = readEadModules()
  const index = modules.findIndex((m) => m.id === moduleId)
  if (index === -1) return null

  const newLesson: EadLesson = {
    ...lesson,
    id: Math.random().toString(36).substring(2, 9), // Simple random string id for lessons
  }

  modules[index].lessons.push(newLesson)
  modules[index].lessons.sort((a, b) => a.order - b.order)
  writeEadModules(modules)
  return newLesson
}

export function updateEadLesson(moduleId: number, lessonId: string, data: Partial<Omit<EadLesson, 'id'>>): EadLesson | null {
  const modules = readEadModules()
  const mIndex = modules.findIndex((m) => m.id === moduleId)
  if (mIndex === -1) return null

  const lIndex = modules[mIndex].lessons.findIndex((l) => l.id === lessonId)
  if (lIndex === -1) return null

  modules[mIndex].lessons[lIndex] = {
    ...modules[mIndex].lessons[lIndex],
    ...data,
  }
  modules[mIndex].lessons.sort((a, b) => a.order - b.order)
  writeEadModules(modules)
  return modules[mIndex].lessons[lIndex]
}

export function deleteEadLesson(moduleId: number, lessonId: string): boolean {
  const modules = readEadModules()
  const mIndex = modules.findIndex((m) => m.id === moduleId)
  if (mIndex === -1) return false

  const initialLength = modules[mIndex].lessons.length
  modules[mIndex].lessons = modules[mIndex].lessons.filter((l) => l.id !== lessonId)
  if (modules[mIndex].lessons.length === initialLength) return false

  writeEadModules(modules)
  return true
}

// Student Progress
function readEadProgress(): EadProgress[] {
  ensureDataDir()
  if (!fs.existsSync(EAD_PROGRESS_FILE)) {
    fs.writeFileSync(EAD_PROGRESS_FILE, '[]', 'utf-8')
    return []
  }
  try {
    const raw = fs.readFileSync(EAD_PROGRESS_FILE, 'utf-8')
    return JSON.parse(raw) as EadProgress[]
  } catch {
    return []
  }
}

function writeEadProgress(progressList: EadProgress[]): void {
  ensureDataDir()
  fs.writeFileSync(EAD_PROGRESS_FILE, JSON.stringify(progressList, null, 2), 'utf-8')
}

export function getStudentProgress(email: string): string[] {
  const progressList = readEadProgress()
  const found = progressList.find((p) => p.userEmail.toLowerCase() === email.toLowerCase().trim())
  return found ? found.completedLessons : []
}

export function toggleLessonCompletion(email: string, moduleId: number, lessonId: string, completed: boolean): string[] {
  const progressList = readEadProgress()
  const emailKey = email.toLowerCase().trim()
  const progressIndex = progressList.findIndex((p) => p.userEmail.toLowerCase() === emailKey)

  const lessonKey = `${moduleId}-${lessonId}`

  if (progressIndex === -1) {
    if (completed) {
      const newProgress: EadProgress = {
        userEmail: emailKey,
        completedLessons: [lessonKey]
      }
      progressList.push(newProgress)
      writeEadProgress(progressList)
      return [lessonKey]
    }
    return []
  }

  const completedLessons = progressList[progressIndex].completedLessons
  if (completed) {
    if (!completedLessons.includes(lessonKey)) {
      completedLessons.push(lessonKey)
    }
  } else {
    progressList[progressIndex].completedLessons = completedLessons.filter((lk) => lk !== lessonKey)
  }

  writeEadProgress(progressList)
  return progressList[progressIndex].completedLessons
}

// Discussion / Chat
function readEadChat(): EadChatMessage[] {
  ensureDataDir()
  if (!fs.existsSync(EAD_CHAT_FILE)) {
    fs.writeFileSync(EAD_CHAT_FILE, '[]', 'utf-8')
    return []
  }
  try {
    const raw = fs.readFileSync(EAD_CHAT_FILE, 'utf-8')
    return JSON.parse(raw) as EadChatMessage[]
  } catch {
    return []
  }
}

function writeEadChat(chat: EadChatMessage[]): void {
  ensureDataDir()
  fs.writeFileSync(EAD_CHAT_FILE, JSON.stringify(chat, null, 2), 'utf-8')
}

export function getEadChatForLesson(moduleId: number, lessonId: string): EadChatMessage[] {
  const chatList = readEadChat()
  return chatList
    .filter((c) => c.moduleId === moduleId && c.lessonId === lessonId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
}

export function listAllEadChats(): EadChatMessage[] {
  return readEadChat().sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function postEadChatMessage(
  moduleId: number,
  lessonId: string,
  userEmail: string,
  userName: string,
  userRole: 'admin' | 'client',
  message: string
): EadChatMessage {
  const chatList = readEadChat()
  const newMsg: EadChatMessage = {
    id: chatList.length > 0 ? Math.max(...chatList.map((c) => c.id)) + 1 : 1,
    moduleId,
    lessonId,
    userEmail: userEmail.toLowerCase().trim(),
    userName,
    userRole,
    message,
    created_at: new Date().toISOString(),
    replies: []
  }
  chatList.push(newMsg)
  writeEadChat(chatList)
  return newMsg
}

export function replyEadChatMessage(
  messageId: number,
  userName: string,
  userRole: 'admin' | 'client',
  message: string
): EadChatMessage | null {
  const chatList = readEadChat()
  const index = chatList.findIndex((c) => c.id === messageId)
  if (index === -1) return null

  if (!chatList[index].replies) {
    chatList[index].replies = []
  }

  chatList[index].replies!.push({
    userName,
    userRole,
    message,
    created_at: new Date().toISOString()
  })

  writeEadChat(chatList)
  return chatList[index]
}

