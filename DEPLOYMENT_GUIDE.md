# Guía de Despliegue: Netlify + Supabase

Esta guía te llevará paso a paso para publicar tu aplicación TDC Cockpit en producción usando Netlify como hosting y Supabase como base de datos.

---

## 📋 Tabla de Contenidos

1. [Preparación del Proyecto](#1-preparación-del-proyecto)
2. [Configuración de Supabase](#2-configuración-de-supabase)
3. [Integración con Supabase](#3-integración-con-supabase)
4. [Despliegue en Netlify](#4-despliegue-en-netlify)
5. [Variables de Entorno](#5-variables-de-entorno)
6. [Verificación Final](#6-verificación-final)
7. [Solución de Problemas](#7-solución-de-problemas)

---

## 1. Preparación del Proyecto

### 1.1 Subir el código a GitHub

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: TDC Cockpit application"

# Crear repositorio en GitHub (desde github.com)
# Luego conectar el repositorio remoto
git remote add origin https://github.com/TU-USUARIO/tu-repositorio.git

# Subir el código
git branch -M main
git push -u origin main
```

### 1.2 Verificar que el build funciona localmente

```bash
# Instalar dependencias
npm install

# Ejecutar build de producción
npm run build

# Probar el build localmente
npm run preview
```

Si todo funciona correctamente, estás listo para continuar.

---

## 2. Configuración de Supabase

### 2.1 Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub (recomendado) o email

### 2.2 Crear un nuevo proyecto

1. Haz clic en "New Project"
2. Completa la información:
   - **Name**: `tdc-cockpit` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (¡GUÁRDALA!)
   - **Region**: Selecciona la más cercana a tus usuarios
   - **Pricing Plan**: Free (para empezar)
3. Haz clic en "Create new project"
4. Espera 2-3 minutos mientras se configura la base de datos

### 2.3 Crear las tablas de la base de datos

Una vez que tu proyecto esté listo, ve a **SQL Editor** en el menú lateral y ejecuta el siguiente script:

```sql
-- Tabla de empleados
CREATE TABLE employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  business_unit TEXT,
  start_date DATE,
  seniority INTEGER DEFAULT 0,
  role TEXT,
  age INTEGER,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de directorio telefónico
CREATE TABLE phone_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  extension TEXT,
  department TEXT,
  position TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de montacargas
CREATE TABLE forklifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT,
  truck_id TEXT NOT NULL,
  serial_number TEXT,
  assigned_operator TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de inventario de equipos
CREATE TABLE equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('radio', 'computer')) NOT NULL,
  brand TEXT NOT NULL,
  assigned_operator TEXT,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de operaciones
CREATE TABLE operations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  customer TEXT NOT NULL,
  truck_operations INTEGER DEFAULT 0,
  pallet_qty INTEGER DEFAULT 0,
  delivery_type TEXT CHECK (delivery_type IN ('delivered', 'received')) NOT NULL,
  responsible TEXT,
  forklift_driver TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de notas
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  content TEXT,
  color TEXT,
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tareas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phone_contacts_updated_at BEFORE UPDATE ON phone_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forklifts_updated_at BEFORE UPDATE ON forklifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_operations_updated_at BEFORE UPDATE ON operations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.4 Configurar políticas de seguridad (RLS)

Para una aplicación simple sin autenticación de usuarios, habilita el acceso público:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forklifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso público (lectura y escritura)
CREATE POLICY "Enable read access for all users" ON employees FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON employees FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON employees FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON phone_contacts FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON phone_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON phone_contacts FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON phone_contacts FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON forklifts FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON forklifts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON forklifts FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON forklifts FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON equipment FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON equipment FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON equipment FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON operations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON operations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON operations FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON operations FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON notes FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON notes FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON notes FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON tasks FOR DELETE USING (true);
```

### 2.5 Obtener las credenciales de Supabase

1. Ve a **Settings** → **API** en el menú lateral
2. Copia estos valores (los necesitarás más adelante):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 3. Integración con Supabase

### 3.1 Crear el cliente de Supabase

Crea un nuevo archivo `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3.2 Crear servicios para cada tabla

Crea un archivo `src/services/database.ts`:

```typescript
import { supabase } from '../lib/supabase';
import type { Employee, PhoneContact, Forklift, EquipmentItem, Operation } from '../context/DataContext';

// Employees
export const employeeService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  create: async (employee: Omit<Employee, 'id'>) => {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, employee: Partial<Employee>) => {
    const { data, error } = await supabase
      .from('employees')
      .update(employee)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Phone Contacts
export const phoneContactService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('phone_contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  create: async (contact: Omit<PhoneContact, 'id'>) => {
    const { data, error } = await supabase
      .from('phone_contacts')
      .insert([contact])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, contact: Partial<PhoneContact>) => {
    const { data, error } = await supabase
      .from('phone_contacts')
      .update(contact)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('phone_contacts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Forklifts
export const forkliftService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('forklifts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  create: async (forklift: Omit<Forklift, 'id'>) => {
    const { data, error } = await supabase
      .from('forklifts')
      .insert([forklift])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, forklift: Partial<Forklift>) => {
    const { data, error } = await supabase
      .from('forklifts')
      .update(forklift)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('forklifts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Equipment
export const equipmentService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  create: async (equipment: Omit<EquipmentItem, 'id'>) => {
    const { data, error } = await supabase
      .from('equipment')
      .insert([equipment])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, equipment: Partial<EquipmentItem>) => {
    const { data, error } = await supabase
      .from('equipment')
      .update(equipment)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Operations
export const operationService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('operations')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  create: async (operation: Omit<Operation, 'id'>) => {
    const { data, error } = await supabase
      .from('operations')
      .insert([operation])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, operation: Partial<Operation>) => {
    const { data, error } = await supabase
      .from('operations')
      .update(operation)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('operations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
```

### 3.3 Actualizar DataContext para usar Supabase

Modifica `src/context/DataContext.tsx` para usar los servicios de Supabase:

```typescript
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { employeeService, phoneContactService, forkliftService, equipmentService, operationService } from '../services/database';

// ... (mantén las interfaces existentes)

export function DataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployeesState] = useState<Employee[]>([]);
  const [phoneContacts, setPhoneContactsState] = useState<PhoneContact[]>([]);
  const [forklifts, setForkliftsState] = useState<Forklift[]>([]);
  const [equipment, setEquipmentState] = useState<EquipmentItem[]>([]);
  const [operations, setOperationsState] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Supabase al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const [emp, phones, forks, equip, ops] = await Promise.all([
          employeeService.getAll(),
          phoneContactService.getAll(),
          forkliftService.getAll(),
          equipmentService.getAll(),
          operationService.getAll()
        ]);

        setEmployeesState(emp);
        setPhoneContactsState(phones);
        setForkliftsState(forks);
        setEquipmentState(equip);
        setOperationsState(ops);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Wrapper para setEmployees que actualiza Supabase
  const setEmployees = async (data: Employee[]) => {
    setEmployeesState(data);
    // Aquí puedes implementar sincronización con Supabase
  };

  // ... (similar para los demás setters)

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DataContext.Provider value={{
      employees, setEmployees,
      phoneContacts, setPhoneContacts,
      forklifts, setForklifts,
      equipment, setEquipment,
      operations, setOperations,
    }}>
      {children}
    </DataContext.Provider>
  );
}
```

### 3.4 Crear archivo .env.local para desarrollo local

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**IMPORTANTE**: Agrega `.env.local` al `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
```

---

## 4. Despliegue en Netlify

### 4.1 Conectar GitHub con Netlify

1. Ve a [https://app.netlify.com](https://app.netlify.com)
2. Inicia sesión con GitHub
3. Haz clic en "Add new site" → "Import an existing project"
4. Selecciona tu repositorio de GitHub

### 4.2 Configurar el build

Netlify detectará automáticamente que es un proyecto Vite. Configura:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18` o superior

### 4.3 Agregar variables de entorno en Netlify

Antes de hacer el primer deploy, agrega las variables de entorno:

1. En la página de configuración del sitio, ve a **Site settings** → **Environment variables**
2. Agrega estas variables:
   - **VITE_SUPABASE_URL**: `https://tu-proyecto.supabase.co`
   - **VITE_SUPABASE_ANON_KEY**: `tu-anon-key-aqui`

### 4.4 Realizar el primer deploy

1. Haz clic en "Deploy site"
2. Espera 2-3 minutos mientras Netlify construye tu aplicación
3. Una vez completado, Netlify te dará una URL como: `https://tu-sitio.netlify.app`

### 4.5 Configurar dominio personalizado (opcional)

Si tienes un dominio propio:

1. Ve a **Domain settings** → **Custom domains**
2. Haz clic en "Add custom domain"
3. Ingresa tu dominio (ejemplo: `cockpit.tudominio.com`)
4. Configura los registros DNS según las instrucciones de Netlify

---

## 5. Variables de Entorno

### Resumen de variables necesarias:

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `VITE_SUPABASE_URL` | URL de tu proyecto Supabase | Settings → API en Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública de Supabase | Settings → API en Supabase |

### Para desarrollo local:

Crea un archivo `.env.local` con:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Para Netlify:

Agrega las mismas variables en:
- Site settings → Environment variables

---

## 6. Verificación Final

### 6.1 Probar la aplicación en producción

1. Abre la URL de Netlify: `https://tu-sitio.netlify.app`
2. Verifica que:
   - ✅ La página de login funciona
   - ✅ Puedes iniciar sesión con `tdc2026@`
   - ✅ Todas las secciones cargan correctamente
   - ✅ Puedes crear, editar y eliminar registros
   - ✅ Los datos se guardan en Supabase
   - ✅ El tema claro/oscuro funciona
   - ✅ El cambio de idioma funciona

### 6.2 Verificar la base de datos

1. Ve a tu proyecto en Supabase
2. Abre **Table Editor**
3. Verifica que las tablas tienen datos cuando los agregas desde la aplicación

### 6.3 Probar en diferentes dispositivos

- ✅ Desktop (Chrome, Firefox, Safari)
- ✅ Tablet (iPad, Android)
- ✅ Mobile (iOS Safari, Android Chrome)

---

## 7. Solución de Problemas

### Problema: "Missing Supabase environment variables"

**Causa**: Las variables de entorno no están configuradas.

**Solución**:
1. Verifica que las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén en Netlify
2. Asegúrate de que empiecen con `VITE_` (requerido para Vite)
3. Haz un nuevo deploy después de agregar las variables

### Problema: "Failed to fetch" o errores de CORS

**Causa**: Problemas de conexión con Supabase.

**Solución**:
1. Verifica que la URL de Supabase sea correcta
2. Verifica que la anon key sea válida
3. Revisa las políticas RLS en Supabase

### Problema: Los datos no se guardan

**Causa**: Políticas RLS bloqueando las operaciones.

**Solución**:
1. Ve a Supabase → Authentication → Policies
2. Verifica que cada tabla tenga políticas de INSERT, UPDATE y DELETE
3. Asegúrate de que las políticas permitan acceso público (para esta configuración simple)

### Problema: Build falla en Netlify

**Causa**: Error en el código o dependencias faltantes.

**Solución**:
1. Revisa los logs de build en Netlify
2. Prueba el build localmente: `npm run build`
3. Verifica que todas las dependencias estén en `package.json`

### Problema: Página en blanco después del deploy

**Causa**: Error de JavaScript en producción.

**Solución**:
1. Abre la consola del navegador (F12)
2. Revisa los errores
3. Verifica que las variables de entorno estén configuradas
4. Asegúrate de que el build local funciona correctamente

---

## 🎉 ¡Listo!

Tu aplicación TDC Cockpit ahora está en producción con:
- ✅ Hosting en Netlify (HTTPS automático)
- ✅ Base de datos en Supabase
- ✅ Deploy automático desde GitHub
- ✅ Variables de entorno seguras

### Próximos pasos recomendados:

1. **Configurar autenticación de usuarios** en Supabase para mayor seguridad
2. **Implementar backups automáticos** de la base de datos
3. **Monitorear el uso** con las herramientas de Netlify y Supabase
4. **Configurar dominios personalizados** si es necesario
5. **Implementar funciones serverless** en Netlify para lógica adicional

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Netlify](https://docs.netlify.com/)
- [Guía de Vite](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)

---

**¿Necesitas ayuda?** Si tienes problemas durante el despliegue, revisa la sección de solución de problemas o consulta la documentación oficial de Supabase y Netlify.
