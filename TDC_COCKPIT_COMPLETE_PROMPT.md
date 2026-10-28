# 🏭 TDC COCKPIT - Prompt Completo del Proyecto

## Documento Maestro para Replicación

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#1-descripción-general)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Diseño Visual](#3-diseño-visual)
4. [Estructura de la Aplicación](#4-estructura-de-la-aplicación)
5. [Sistema de Autenticación](#5-sistema-de-autenticación)
6. [Sección: Dashboard Principal](#6-sección-dashboard-principal)
7. [Sección: Empleados](#7-sección-empleados)
8. [Sección: Directorio Telefónico](#8-sección-directorio-telefónico)
9. [Sección: Forklifts](#9-sección-forklifts)
10. [Sección: Inventario de Equipo](#10-sección-inventario-de-equipo)
11. [Sección: Registro de Operaciones](#11-sección-registro-de-operaciones)
12. [Sección: Notas Rápidas](#12-sección-notas-rápidas)
13. [Sección: Tareas](#13-sección-tareas)
14. [Internacionalización](#14-internacionalización)
15. [Responsive Design](#15-responsive-design)
16. [Animaciones y Micro-interacciones](#16-animaciones-y-micro-interacciones)
17. [Persistencia de Datos](#17-persistencia-de-datos)
18. [Deploy y Hosting](#18-deploy-y-hosting)

---

## 1. DESCRIPCIÓN GENERAL

### Nombre del Proyecto
**TDC Cockpit** (Troup Distribution Center Cockpit)

### Propósito
Aplicación web tipo "cockpit" o dashboard de operaciones para gestión integral de un centro de distribución de warehouse. Permite tener toda la información operativa en un solo lugar para consultas rápidas y gestión diaria.

### Usuario Principal
**Uriel Ceballos** - Administrador/Supervisor del centro de distribución

### Filosofía de Diseño
- Premium SaaS operations dashboard
- Estética moderna tipo fintech/enterprise
- Glassmorphism con influencias iOS
- Alta densidad de información sin sacrificar legibilidad
- Profesional pero elegante
- Multiplataforma (desktop, tablet, mobile)

---

## 2. STACK TECNOLÓGICO

### Frontend
- **React 18** con TypeScript
- **Vite** como build tool
- **Tailwind CSS v4** para estilos
- **Lucide React** para iconos
- **UUID** para generación de IDs únicos
- **XLSX** para importación de archivos Excel

### Estado y Datos
- **React Context API** para estado global
- **localStorage** para persistencia local
- **Supabase** (opcional) para base de datos en la nube

### Deploy
- **Netlify** para hosting
- **GitHub** para control de versiones
- Deploy automático desde Git

---

## 3. DISEÑO VISUAL

### 3.1 Paleta de Colores

#### Light Mode
```
Background Page:    Gradiente (#f8fafc → #f1f5f9 → #e0e7ff)
Surface Cards:      rgba(255, 255, 255, 0.85) con blur
Surface Secondary:  rgba(255, 255, 255, 0.65)
Text Primary:       #1e293b
Text Secondary:     #475569
Text Muted:         #94a3b8
Border:             rgba(255, 255, 255, 0.65)
Accent Primary:     #6366f1 (Indigo)
Accent Hover:       #4f46e5
Success:            #10b981 (Emerald)
Warning:            #f59e0b (Amber)
Danger:             #ef4444 (Red)
```

#### Dark Mode
```
Background Page:    Gradiente (#0f172a → #1e1b4b → #312e81)
Surface Cards:      rgba(30, 27, 75, 0.65) con blur
Surface Secondary:  rgba(49, 46, 129, 0.45)
Text Primary:       #f8fafc
Text Secondary:     #cbd5e1
Text Muted:         #64748b
Border:             rgba(255, 255, 255, 0.12)
Accent Primary:     #818cf8 (Indigo claro)
Accent Hover:       #6366f1
Success:            #34d399
Warning:            #fbbf24
Danger:             #f87171
```

### 3.2 Gradientes de Acento

```css
Cyan:    linear-gradient(135deg, #06b6d4, #22d3ee)
Blue:    linear-gradient(135deg, #3b82f6, #60a5fa)
Pink:    linear-gradient(135deg, #ec4899, #f472b6)
Purple:  linear-gradient(135deg, #8b5cf6, #a78bfa)
Indigo:  linear-gradient(135deg, #6366f1, #818cf8)
Hero:    linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)
```

### 3.3 Tipografía

- **Fuente**: Inter (Google Fonts)
- **Display**: 2rem, weight 800, letter-spacing -0.025em
- **Heading**: 1.5rem, weight 700, letter-spacing -0.02em
- **Subheading**: 1.125rem, weight 600
- **Body**: 0.875rem, weight 400
- **Caption**: 0.75rem, weight 500
- **Label**: 0.75rem, weight 600, uppercase, letter-spacing 0.05em

### 3.4 Efectos Visuales

#### Glassmorphism
```css
backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);
```

#### Sombras
```css
Shadow Glass:       0 8px 32px rgba(99, 102, 241, 0.08)
Shadow Glass Hover: 0 12px 40px rgba(99, 102, 241, 0.12)
```

#### Border Radius
```
Cards:        16px
Buttons:      10px
Inputs:       10px
Badges:       8px
Icon Boxes:   10-12px
Modals:       20px
```

### 3.5 Sidebar

- **Fondo**: Gradiente vertical (#312e81 → #4338ca)
- **Ancho**: 260px
- **Texto**: Blanco con opacidades variables
- **Item activo**: Gradiente (#6366f1 → #818cf8) con shadow
- **Hover**: rgba(255, 255, 255, 0.1)

---

## 4. ESTRUCTURA DE LA APLICACIÓN

### 4.1 Arquitectura de Componentes

```
src/
├── App.tsx                    # Componente raíz con providers
├── main.tsx                   # Entry point
├── index.css                  # Estilos globales y sistema de diseño
│
├── context/
│   ├── AuthContext.tsx        # Estado de autenticación
│   ├── ThemeContext.tsx       # Estado de tema (light/dark)
│   ├── LanguageContext.tsx    # Estado de idioma (en/es)
│   └── DataContext.tsx        # Estado de datos (CRUD)
│
├── components/
│   └── Layout.tsx             # Layout principal con sidebar
│
├── pages/
│   ├── Login.tsx              # Pantalla de inicio de sesión
│   ├── LockedScreen.tsx       # Pantalla de sesión bloqueada
│   ├── Dashboard.tsx          # Panel principal
│   ├── Employees.tsx          # Gestión de empleados
│   ├── PhoneDirectory.tsx     # Directorio telefónico
│   ├── Forklifts.tsx          # Gestión de montacargas
│   ├── Equipment.tsx          # Inventario de equipos
│   ├── Operations.tsx         # Registro de operaciones
│   ├── Notes.tsx              # Notas rápidas
│   └── Tasks.tsx              # Gestión de tareas
│
├── i18n/
│   └── translations.ts        # Traducciones en/es
│
└── lib/
    └── supabase.ts            # Cliente de Supabase (opcional)
```

### 4.2 Flujo de la Aplicación

```
1. Usuario abre la app
2. ¿Está autenticado?
   - NO → Mostrar Login
   - SÍ → ¿Está bloqueada la sesión?
     - SÍ → Mostrar LockedScreen
     - NO → Mostrar Layout + Dashboard
3. Usuario navega entre secciones
4. Usuario puede bloquear sesión o cerrar sesión
```

### 4.3 Navegación (Sidebar)

```
📊 TDC Cockpit (Dashboard)
👥 Empleados
📞 Directorio Telefónico
🚜 Forklifts
📻 Inventario de Equipo
📋 Registro de Operaciones
📝 Notas Rápidas
✅ Tareas
─────────────────
🌙 Dark Mode / ☀️ Light Mode
🌐 English / Español
🔒 Bloquear Sesión
🚪 Cerrar Sesión
```

---

## 5. SISTEMA DE AUTENTICACIÓN

### 5.1 Pantalla de Login

**Diseño:**
- Fondo con gradientes decorativos (blur circles)
- Card central con glassmorphism
- Logo "T" con gradiente triple (indigo-purple-pink)
- Título: "Welcome Uriel" con gradiente de texto
- Subtítulo: "TDC Cockpit • Operations Hub"
- Input de contraseña con icono de candado
- Toggle para mostrar/ocultar contraseña
- Botón "Sign In" con gradiente y shadow
- Footer: "Troup Distribution Center"
- Credit: "Designed & Created by Uriel Ceballos"

**Comportamiento:**
- Contraseña correcta: `tdc2026@`
- Animación de carga al validar
- Mensaje de error si la contraseña es incorrecta
- Persistencia en localStorage (no pide login al recargar)
- Toggle de tema (light/dark) en esquina superior derecha

### 5.2 Pantalla de Sesión Bloqueada

**Diseño:**
- Similar al login pero con icono de candado grande
- Gradiente púrpura en el icono
- Título: "Session Locked" / "Sesión Bloqueada"
- Subtítulo: "Enter your password to unlock"
- Input de contraseña
- Botón "Unlock" / "Desbloquear"
- Link alternativo: "Sign out instead" / "Cerrar sesión"

**Comportamiento:**
- Requiere la misma contraseña: `tdc2026@`
- Al desbloquear, regresa a la página donde estaba
- Persistencia del estado bloqueado en localStorage

### 5.3 Cerrar Sesión

- Limpia toda la autenticación
- Regresa a la pantalla de login
- Elimina datos de localStorage relacionados con auth

---

## 6. SECCIÓN: DASHBOARD PRINCIPAL

### 6.1 Welcome Card

**Contenido:**
- Título grande: "Welcome back 👋" (con gradiente indigo-purple-cyan)
- El emoji 👋 NO tiene gradiente (se ve amarillo natural)
- Subtítulo: "Today's Overview" / "Resumen de Hoy"

### 6.2 Hero Card - Ubicación TDC

**Diseño:**
- Card horizontal prominente
- Fondo: Gradiente blue → purple → cyan
- Efecto glassmorphism con radial gradient overlay
- Icono de ubicación en contenedor glass (w-16 h-16)

**Contenido:**
- **Nombre**: Troup Distribution Center
- **Dirección**: 1394 VALLEY INDUSTRIAL BLVD, Valley, AL 36854
- **Badge SQF** (alineado a la derecha):
  - Fondo translúcido glass
  - Label: "TOTAL SQF" (uppercase)
  - Valor: **495,687** (texto blanco grande)

### 6.3 KPI Cards (4 tarjetas)

**Grid**: 1 columna (mobile) → 2 columnas (tablet) → 4 columnas (desktop)

**Card 1 - Total Empleados:**
- Icono: Users en gradiente blue
- Valor: Conteo de empleados
- Label: "Total Employees" / "Total Empleados"

**Card 2 - Montacargas Activos:**
- Icono: Truck en gradiente cyan
- Valor: Conteo de forklifts
- Label: "Active Forklifts" / "Montacargas Activos"

**Card 3 - Operaciones de Hoy:**
- Icono: ClipboardList en gradiente purple
- Valor: Conteo de operaciones del día actual
- Label: "Today's Operations" / "Operaciones de Hoy"

**Card 4 - Cantidad de Equipo:**
- Icono: Radio en gradiente pink
- Valor: Conteo total de equipos (radios + computadoras)
- Label: "Equipment Count" / "Cantidad de Equipo"

**Diseño de cada KPI:**
- Números grandes (text-3xl) con gradiente de texto
- Icono en contenedor con gradiente y shadow
- Icono de TrendingUp en color success
- Hover: elevación + escala (translateY -4px, scale 1.02)

### 6.4 Summary del Día

**Card izquierda - Resumen de Hoy:**
- Título con icono Package en gradiente purple-pink
- Fecha actual
- 3 métricas con separadores:
  - Total Pallets (gradiente purple-pink)
  - Total Delivered (gradiente emerald-cyan)
  - Total Received (gradiente blue-indigo)

**Card derecha - Actividad Reciente:**
- Título con icono ClipboardList en gradiente indigo-purple
- Lista de las últimas 5 operaciones
- Cada item muestra:
  - Nombre del cliente
  - Fecha
  - Cantidad de pallets
  - Badge de tipo (Delivered/Received) con colores semitransparentes

### 6.5 Quick Info Cards (3 tarjetas)

**Grid**: 1 columna (mobile) → 3 columnas (desktop)

**Card 1 - Top Customers:**
- Dot indicator con gradiente cyan-blue
- Top 3 clientes por cantidad de pallets
- Nombre del cliente + cantidad

**Card 2 - Active Drivers:**
- Dot indicator con gradiente emerald-cyan
- Lista de operadores únicos de las operaciones
- Punto verde con shadow

**Card 3 - Business Units:**
- Dot indicator con gradiente purple-pink
- Lista de unidades de negocio únicas de empleados
- Punto púrpura con shadow

---

## 7. SECCIÓN: EMPLEADOS

### 7.1 Campos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Full Name | Text | ✅ | Nombre completo del empleado |
| Business Unit | Text | ❌ | Unidad de negocio a la que pertenece |
| Start Date | Date | ❌ | Fecha de ingreso |
| Seniority | Number | ❌ | Años de antigüedad (se calcula automáticamente desde Start Date) |
| Role | Text | ❌ | Rol o puesto |
| Age | Number | ❌ | Edad |
| Phone | Tel | ❌ | Número de teléfono |

### 7.2 Funcionalidades

- **Tabla responsiva** con columnas que se ocultan en mobile
- **Búsqueda** por nombre, business unit o rol
- **CRUD completo**: Crear, Leer, Actualizar, Eliminar
- **Cálculo automático** de antigüedad basado en fecha de inicio
- **Modal form** con glassmorphism para agregar/editar
- **Badges** para antigüedad

### 7.3 Diseño de Tabla

- Headers con padding px-6 py-4
- Filas con hover state sutil
- Botones de acción con backgrounds contextuales (indigo-50 para edit, red-50 para delete)
- Iconos Edit2 y Trash2 de Lucide

---

## 8. SECCIÓN: DIRECTORIO TELEFÓNICO

### 8.1 Campos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Name | Text | ✅ | Nombre completo |
| Phone | Tel | ✅ | Número de teléfono |
| Extension | Text | ❌ | Extensión telefónica |
| Department | Text | ❌ | Departamento |
| Position | Text | ❌ | Posición/Cargo |
| Email | Email | ❌ | Correo electrónico |

### 8.2 Funcionalidades

- **Vista de cards** (grid responsive)
- **Avatar** con iniciales del nombre en gradiente purple-pink
- **Búsqueda** por nombre, departamento o teléfono
- **CRUD completo**
- **Badge** para extensión telefónica

### 8.3 Diseño de Card

- Avatar circular con gradiente
- Nombre en bold
- Posición + Departamento en muted
- Teléfono con icono verde
- Email con icono azul
- Hover: elevación + scale

---

## 9. SECCIÓN: FORKLIFTS

### 9.1 Campos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Brand | Text | ❌ | Marca del montacargas |
| Truck ID | Text | ✅ | Identificador único de la unidad |
| Serial Number | Text | ❌ | Número de serie |
| Assigned Operator | Text | ❌ | Operador asignado |

### 9.2 Funcionalidades

- **Tabla responsiva**
- **Búsqueda** por cualquier campo
- **CRUD completo**
- **Badge** para Truck ID con color accent

### 9.3 Diseño

- Truck ID destacado con badge
- Serial Number en fuente monoespaciada
- Columnas ocultas en mobile según prioridad

---

## 10. SECCIÓN: INVENTARIO DE EQUIPO

### 10.1 Campos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Type | Select | ✅ | Tipo: 'radio' (Walkie Talkie) o 'computer' |
| Brand | Text | ✅ | Marca del equipo |
| Assigned Operator | Text | ❌ | Operador asignado |
| Comments | Textarea | ❌ | Comentarios adicionales |

### 10.2 Funcionalidades

- **3 KPI Cards** en la parte superior:
  - Radios (icono Radio, gradiente cyan-blue)
  - Computadoras (icono Monitor, gradiente indigo-purple)
  - Total (número grande, gradiente purple-pink)
- **Filtros** por tipo (All / Radio / Computer)
- **Búsqueda** por marca, operador o comentarios
- **CRUD completo**
- **Badge** con icono para distinguir tipo

### 10.3 Diseño

- Badges con colores semitransparentes
- Radio: cyan con icono RadioIcon
- Computer: indigo con icono Monitor
- KPIs con iconos en contenedores con gradiente y shadow

---

## 11. SECCIÓN: REGISTRO DE OPERACIONES

### 11.1 Campos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Date | Date | ✅ | Fecha de la operación |
| Customer | Text | ✅ | Nombre del cliente |
| Truck Operations | Number | ❌ | Número de operaciones de camión |
| Pallet Qty | Number | ❌ | Cantidad de tarimas/pallets |
| Delivery Type | Select | ✅ | 'delivered' o 'received' |
| Responsible | Text | ❌ | Persona responsable |
| Forklift Driver | Text | ❌ | Operador del montacargas |

### 11.2 Funcionalidades

#### Monthly Dashboard
- Selector de mes y año
- 4 KPIs con gradientes de texto:
  - Total Pallets (purple-pink)
  - Total Delivered (cyan-blue)
  - Total Received (indigo-purple)
  - Truck Operations (pink-rose)

#### Daily Dashboard
- Selector de fecha
- 4 KPIs del día seleccionado
- Lista de operaciones del día con badges de tipo

#### Previous Day Dashboard
- Muestra automáticamente el día anterior
- Mismos 4 KPIs
- Lista de operaciones del día anterior

#### Operations Table
- Tabla completa con todas las operaciones del mes filtrado
- Ordenadas por fecha (más reciente primero)
- Búsqueda por cliente, responsable o driver
- CRUD completo

#### Importación de Excel
- Botón "Import Excel"
- Modal con:
  - Selector de archivo (.xlsx, .xls, .csv)
  - Preview de datos detectados (primeras 10 filas)
  - Contador de registros válidos
  - **Campo de contraseña obligatorio**: `tdc2026@`
  - Botón de confirmación (solo habilitado con datos + contraseña)
  - Instrucciones de columnas esperadas

**Mapeo inteligente de columnas:**
- Date: `date`, `Date`, `fecha`, `Fecha`
- Customer: `customer`, `Customer`, `cliente`, `Cliente`
- Pallet Qty: `palletQty`, `Pallet Qty`, `tarimas`, `Cantidad de tarimas`
- Delivery Type: detecta "received"/"recibido"
- Responsible: `responsible`, `Responsible`, `responsable`, `Responsable`
- Forklift Driver: `forkliftDriver`, `Forklift Driver`, `operador`, `Operador`

**Manejo de fechas:**
- Soporta fechas en formato Excel (número serial)
- Soporta strings de fecha comunes
- Convierte automáticamente a formato YYYY-MM-DD

### 11.3 Diseño

- KPIs con iconos en contenedores con gradiente
- Números con gradientes de texto
- Badges semitransparentes para Delivered/Received
- Delivered: cyan con fondo rgba(6, 182, 212, 0.1)
- Received: indigo con fondo rgba(99, 102, 241, 0.1)

---

## 12. SECCIÓN: NOTAS RÁPIDAS

### 12.1 Campos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Title | Text | ❌ | Título de la nota |
| Content | Textarea | ❌ | Contenido de la nota |
| Color | Select | ❌ | Color del gradiente de fondo |
| Pinned | Boolean | ❌ | Si está fijada arriba |
| Created At | Auto | ✅ | Fecha de creación automática |

### 12.2 Colores Disponibles

6 opciones de gradientes sutiles:
1. Blue: `linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.08))`
2. Purple: `linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(168, 85, 247, 0.08))`
3. Green: `linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.08))`
4. Orange: `linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(236, 72, 153, 0.08))`
5. Pink: `linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(244, 114, 182, 0.08))`
6. Yellow: `linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(251, 191, 36, 0.08))`

### 12.3 Funcionalidades

- **Grid de cards** responsive (1-3 columnas)
- **CRUD completo**
- **Pin/Unpin** notas importantes
- **Ordenamiento**: Pinned primero, luego por fecha de creación
- **Selector de color** visual en el modal
- **Footer** con fecha/hora de creación
- **Empty state** elegante cuando no hay notas

### 12.4 Diseño

- Pin indicator: círculo con gradiente pink-purple en esquina superior derecha
- Botones de acción: pin y delete con hover states
- Footer con borde sutil y fecha con icono Clock
- Hover: elevación + scale

---

## 13. SECCIÓN: TAREAS

### 13.1 Campos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Title | Text | ✅ | Descripción de la tarea |
| Priority | Select | ❌ | 'high', 'medium', 'low' |
| Due Date | Date | ❌ | Fecha límite |
| Completed | Boolean | ❌ | Estado de completado |
| Completed At | DateTime | ❌ | Fecha/hora de completado |
| Created At | DateTime | ✅ | Fecha de creación automática |

### 13.2 Funcionalidades

- **Auto-hide**: Las tareas completadas se ocultan automáticamente después de 3 segundos
- **CRUD completo**
- **Marcar como completada** con checkbox circular
- **Prioridades** con colores y iconos:
  - High: rojo con icono AlertTriangle
  - Medium: ámbar con icono Zap
  - Low: cyan con icono Circle
- **Vista de completadas** colapsable (botón contador)
- **Empty state** motivacional: "All caught up! No pending tasks."

### 13.3 Diseño

- Cards con checkbox circular grande
- Badges de prioridad con colores semitransparentes
- Botón de delete aparece en hover
- Tareas completadas: opacity reducida, texto con strikethrough
- Fecha límite con icono Clock

---

## 14. INTERNACIONALIZACIÓN

### 14.1 Idiomas Soportados

- **English (en)** - Por defecto
- **Español (es)**

### 14.2 Sistema

- Context de React para estado global
- Función `t(key)` para obtener traducciones
- Persistencia en localStorage
- Switch en el sidebar con badge indicador (ES/EN)

### 14.3 Claves de Traducción Principales

```typescript
// Navegación
dashboard, employees, phoneDirectory, forklifts, equipment, operations, quickNotes, tasks

// Comunes
add, edit, delete, save, cancel, search, noData, confirm, actions, name, phone, email, department, role, status, active, inactive, filter, export, total

// Dashboard
welcomeBack, todayOverview, totalEmployees, activeForklifts, todayOperations, equipmentCount, recentActivity, quickStats

// Empleados
fullName, businessUnit, startDate, seniority, age, addEmployee, editEmployee

// Teléfono
extension, position, addContact, editContact

// Forklifts
brand, truckId, serialNumber, assignedOperator, addForklift, editForklift

// Equipo
type, radio, computer, comments, addEquipment, editEquipment

// Operaciones
date, customer, truckOperations, palletQty, deliveryType, delivered, received, responsible, forkliftDriver, addOperation, editOperation, monthFilter, yearFilter, dailyDashboard, previousDay, summary, totalPallets, totalDelivered, totalReceived

// Notas y Tareas
quickNotes, notes, addNote, tasks, addTask, pendingTasks, completedTasks, priority, high, medium, low, dueDate, markComplete, noPendingTasks

// Auth
taskCockpit, logout, lockSession, sessionLocked, enterPasswordToUnlock, incorrectPassword, unlock, signOutInstead

// Meses
january, february, march, april, may, june, july, august, september, october, november, december
```

---

## 15. RESPONSIVE DESIGN

### 15.1 Breakpoints

```css
Mobile:  < 640px   (sm)
Tablet:  640-1024px (md, lg)
Desktop: > 1024px
```

### 15.2 Comportamiento Responsive

#### Sidebar
- **Desktop**: Visible, fijo, 260px de ancho
- **Mobile**: Oculto, se abre con botón hamburguesa, overlay con blur

#### Dashboard
- **Mobile**: 1 columna para KPIs y cards
- **Tablet**: 2 columnas para KPIs
- **Desktop**: 4 columnas para KPIs, 2 columnas para summary

#### Tablas
- **Mobile**: Columnas menos importantes se ocultan
- **Tablet**: Se muestran más columnas
- **Desktop**: Todas las columnas visibles
- **Overflow**: Scroll horizontal cuando es necesario

#### Modales
- **Mobile**: Full screen con padding
- **Desktop**: Centrado con max-width

#### Cards
- **Mobile**: Stack vertical
- **Tablet**: 2 columnas
- **Desktop**: 3-4 columnas según sección

---

## 16. ANIMACIONES Y MICRO-INTERACCIONES

### 16.1 Transiciones de Página

```css
@keyframes page-enter {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Duración: 350ms, easing: cubic-bezier(0.16, 1, 0.3, 1) */
```

### 16.2 Animaciones de Entrada

```css
fade-in-up:     400ms, translateY(20px → 0)
fade-in-down:   400ms, translateY(-20px → 0)
fade-in-left:   400ms, translateX(-20px → 0)
fade-in-right:  400ms, translateX(20px → 0)
scale-in:       300ms, scale(0.95 → 1)
```

### 16.3 Stagger Effect

Elementos del Dashboard aparecen en secuencia:
- Welcome card: stagger-0
- Hero card: stagger-1
- KPI cards: stagger-2 a stagger-5
- Summary cards: stagger-6, stagger-7
- Quick info cards: stagger-8

Delay entre elementos: 50ms

### 16.4 Modales

```css
Overlay:  fade in 300ms, fade out 200ms
Content:  scale(0.9 → 1) + translateY(20px → 0), 350ms
```

### 16.5 Botones

```css
Hover:   translateY(-1px), shadow increase
Active:  scale(0.96), 100ms
Transition: 200ms cubic-bezier(0.34, 1.56, 0.64, 1)
```

### 16.6 Cards

```css
Hover:   translateY(-4px) scale(1.02), 250ms
Active:  translateY(-1px) scale(0.99), 100ms
```

### 16.7 Sidebar

```css
Nav items: 250ms cubic-bezier(0.16, 1, 0.3, 1)
Active:    scale(0.97) on click, 100ms
```

### 16.8 Theme Transition

```css
Cambio de tema: 400ms cubic-bezier(0.4, 0, 0.2, 1)
Se aplica a: background, color
Se limpia automáticamente después de la animación
```

### 16.9 Accesibilidad

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 17. PERSISTENCIA DE DATOS

### 17.1 localStorage Keys

```javascript
// Autenticación
'cockpit-auth'      // boolean - usuario autenticado
'cockpit-locked'    // boolean - sesión bloqueada

// Tema
'cockpit-theme'     // 'light' | 'dark'

// Idioma
'cockpit-language'  // 'en' | 'es'

// Datos
'cockpit-employees'  // Employee[]
'cockpit-phones'     // PhoneContact[]
'cockpit-forklifts'  // Forklift[]
'cockpit-equipment'  // EquipmentItem[]
'cockpit-operations' // Operation[]
'cockpit-notes'      // Note[]
'cockpit-tasks'      // Task[]
```

### 17.2 Estructura de Datos

```typescript
interface Employee {
  id: string;
  fullName: string;
  businessUnit: string;
  startDate: string;
  seniority: number;
  role: string;
  age: number;
  phone: string;
}

interface PhoneContact {
  id: string;
  name: string;
  phone: string;
  extension: string;
  department: string;
  position: string;
  email: string;
}

interface Forklift {
  id: string;
  brand: string;
  truckId: string;
  serialNumber: string;
  assignedOperator: string;
}

interface EquipmentItem {
  id: string;
  type: 'radio' | 'computer';
  brand: string;
  assignedOperator: string;
  comments: string;
}

interface Operation {
  id: string;
  date: string;
  customer: string;
  truckOperations: number;
  palletQty: number;
  deliveryType: 'delivered' | 'received';
  responsible: string;
  forkliftDriver: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
}
```

### 17.3 Migración a Supabase (Opcional)

Si se desea migrar de localStorage a Supabase:

1. Crear proyecto en Supabase
2. Ejecutar SQL para crear tablas (ver DEPLOYMENT_GUIDE.md)
3. Crear cliente Supabase en `src/lib/supabase.ts`
4. Crear servicios en `src/services/database.ts`
5. Actualizar DataContext para usar servicios de Supabase
6. Agregar variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## 18. DEPLOY Y HOSTING

### 18.1 Configuración de Netlify

```
Build command:    npm run build
Publish directory: dist
Node version:     18+
```

### 18.2 Variables de Entorno (si usa Supabase)

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 18.3 Deploy Automático

1. Subir código a GitHub
2. Conectar repositorio con Netlify
3. Configurar build settings
4. Agregar variables de entorno
5. Deploy automático en cada push

### 18.4 Dominio Personalizado (Opcional)

- Configurar en Netlify → Domain settings
- Agregar registro CNAME en el proveedor de dominio
- HTTPS automático con Let's Encrypt

---

## 🎯 RESUMEN EJECUTIVO

**TDC Cockpit** es una aplicación web premium de gestión operativa para centros de distribución que combina:

✅ **Diseño Premium**: Glassmorphism, gradientes, animaciones iOS-like
✅ **8 Secciones Funcionales**: Dashboard, Empleados, Directorio, Forklifts, Equipo, Operaciones, Notas, Tareas
✅ **Autenticación Segura**: Login con contraseña + bloqueo de sesión
✅ **Bilingüe**: Inglés/Español con switch instantáneo
✅ **Temas**: Light/Dark mode con transiciones suaves
✅ **Responsive**: Desktop, tablet, mobile
✅ **Import Excel**: Con confirmación por contraseña
✅ **Persistencia**: localStorage (o Supabase opcional)
✅ **Deploy Fácil**: Netlify + GitHub

**Contraseña de acceso**: `tdc2026@`

**Creado por**: Uriel Ceballos

---

## 📚 ARCHIVOS IMPORTANTES

- `DEPLOYMENT_GUIDE.md` - Guía completa de despliegue con Supabase
- `src/index.css` - Sistema de diseño completo
- `src/i18n/translations.ts` - Todas las traducciones
- `src/context/` - Todos los contextos de la aplicación
- `src/pages/` - Todas las páginas/secciones

---

**Fin del documento maestro de replicación**
