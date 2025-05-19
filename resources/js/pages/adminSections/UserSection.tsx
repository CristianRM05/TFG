// components/UserSection.tsx
"use client"

import React from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Users } from "lucide-react"
import Swal from "sweetalert2"
import { router } from "@inertiajs/react"
import type { User } from "@/types"
import axios from 'axios'

interface Props {
    styles: any
    users: User[]
    loading: boolean
    openSection: string | null
    setOpenSection: (section: string | null) => void
    currentPage: number
    setCurrentPage: (page: number) => void
    totalPages: number
    perPage: number
    totalUsers: number
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
    roles: string[] // Lista de roles disponibles
    authUser: {
  id: number;
}

}

const UserSection: React.FC<Props> = ({
    styles,
    users,
    loading,
    openSection,
    setOpenSection,
    currentPage,
    setCurrentPage,
    totalPages,
    perPage,
    totalUsers,
    setUsers,
    authUser, // <-- add this line

}) => {
    const handleBanToggle = (user: User) => {
        Swal.fire({
            title: `¿Estás seguro de querer ${user.banned_at ? "desbanear" : "banear"} a ${user.name}?`,
            icon: user.banned_at ? "question" : "warning",
            showCancelButton: true,
            confirmButtonColor: styles.primary,
            cancelButtonColor: styles.secondary,
            confirmButtonText: user.banned_at ? "Sí, desbanear" : "Sí, banear",
            cancelButtonText: "Cancelar",
            background: styles.light,
            customClass: {
                popup: 'shadow-lg',
                confirmButton: 'hover:opacity-90 transition-opacity'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(`/admin/users/${user.id}/ban`, {
                    banned: !user.banned_at,
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setUsers(prev => prev.map(u => u.id === user.id ? {
                            ...u,
                            banned_at: user.banned_at ? null : new Date().toISOString()
                        } : u))
                        Swal.fire({
                            icon: "success",
                            title: user.banned_at ? "Usuario desbaneado" : "Usuario baneado",
                            showConfirmButton: false,
                            timer: 1800,
                            background: styles.light,
                            customClass: { popup: 'shadow-lg' }
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: "error",
                            title: "Error en el proceso",
                            text: "No se pudo actualizar el estado del usuario.",
                            background: styles.light,
                            customClass: { popup: 'shadow-lg' }
                        });
                    }
                })
            }
        });
    }
    const roles = ["Admin", "Manager", "Cliente"];


const handleRoleChange = (user: User, newRole: string) => {
    if (newRole === user.role) return;

    Swal.fire({
        title: `¿Cambiar rol de ${user.name}?`,
        text: `¿Estás seguro de querer cambiar el rol de ${user.name} de ${user.role} a ${newRole}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: styles.primary,
        cancelButtonColor: styles.secondary,
        confirmButtonText: "Sí, cambiar rol",
        cancelButtonText: "Cancelar",
        background: styles.light,
        customClass: {
            popup: 'shadow-lg',
            confirmButton: 'hover:opacity-90 transition-opacity'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            axios.patch(`/admin/users/${user.id}/role`, { role: newRole })
                .then((response) => {
                    setUsers(prev => prev.map(u => u.id === user.id ? {
                        ...u,
                        role: newRole
                    } : u));
                    Swal.fire({
                        icon: "success",
                        title: "Rol actualizado",
                        text: `El rol de ${user.name} ha sido actualizado a ${newRole}`,
                        showConfirmButton: false,
                        timer: 1800,
                        background: styles.light,
                        customClass: { popup: 'shadow-lg' }
                    });
                })
                .catch(() => {
                    Swal.fire({
                        icon: "error",
                        title: "Error en el proceso",
                        text: "No se pudo actualizar el rol del usuario.",
                        background: styles.light,
                        customClass: { popup: 'shadow-lg' }
                    });
                });
        }
    });
}

    return (
        <>
            {/* Header desplegable */}
            <div className="p-6 border-b cursor-pointer"
                style={{ borderColor: `${styles.secondary}30` }}
                onClick={() => setOpenSection(openSection === "users" ? null : "users")}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users size={24} style={{ color: styles.primary }} />
                        <h2 className="text-2xl font-bold" style={{ color: styles.dark }}>Gestión de Usuarios</h2>
                    </div>
                    {openSection === "users" ? <ChevronUp size={24} style={{ color: styles.primary }} /> : <ChevronDown size={24} style={{ color: styles.primary }} />}
                </div>
            </div>

            {openSection === "users" && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                        <thead style={{ backgroundColor: `${styles.secondary}10` }}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Nombre</th>
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Email</th>
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Teléfono</th>
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Rol</th>
                                <th className="px-6 py-4 text-left text-xs font-medium uppercase" style={{ color: styles.secondary }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y" style={{ borderColor: `${styles.secondary}20` }}>
                            {users.length > 0 ? users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover ring-2" style={{ borderColor: styles.primary }} />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full flex items-center justify-center text-lg font-medium"
                                                    style={{ backgroundColor: `${styles.primary}20`, color: styles.primary }}>
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium" style={{ color: styles.dark }}>
                                                    {user.name} {user.last_name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                                    <td className="px-6 py-4">
                                        <select
  disabled={authUser.id === user.id} // 👈 aquí está la magia
  className="px-3 py-1 text-xs leading-5 font-semibold rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-pointer disabled:opacity-60"
  style={{
    backgroundColor: user.role === "Admin" ? "#fef9c3" : user.role === "Manager" ? "#dbeafe" : "rgba(0,128,0,0.2)",
    color: user.role === "Admin" ? "#b45309" : user.role === "Manager" ? "#1d4ed8" : "green",
    boxShadow: "none",
    appearance: "auto",
    focusRingColor: styles.primary
  }}
  value={user.role}
  onChange={(e) => handleRoleChange(user, e.target.value)}
>
  {roles.map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ))}
</select>

                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleBanToggle(user)}
                                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                                            style={{
                                                backgroundColor: user.banned_at ? "rgba(0,128,0,0.15)" : "rgba(220,38,38,0.15)",
                                                color: user.banned_at ? "green" : "#dc2626"
                                            }}
                                        >
                                            {user.banned_at ? "Desbanear" : "Banear"}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-500 py-8">No hay usuarios registrados</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center p-6 text-sm text-gray-600">
                            <div>
                                Mostrando {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, totalUsers)} de {totalUsers}
                            </div>
                            <div className="flex gap-2 items-center">
                                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50" style={{ color: styles.secondary }}>
                                    <ChevronLeft size={18} />
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i
                                    return (
                                        <button key={page} onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-lg font-medium ${currentPage === page ? "shadow-md" : ""}`}
                                            style={{
                                                backgroundColor: currentPage === page ? styles.primary : "transparent",
                                                color: currentPage === page ? "white" : styles.secondary,
                                                border: currentPage === page ? "none" : `1px solid ${styles.secondary}30`
                                            }}>
                                            {page}
                                        </button>
                                    )
                                })}
                                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50" style={{ color: styles.secondary }}>
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default UserSection
