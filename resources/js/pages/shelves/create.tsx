"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog } from "@headlessui/react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import InputError from "@/components/input-error"
import Swal from "sweetalert2"
import { X } from "lucide-react"

const COLORS = {
    primary: "#8F5C0C",
    secondary: "#7C5F42",
    black: "#000000",
    white: "#F3F3F1",
}

interface Props {
    open: boolean
    onClose: () => void
    shelfData: {
        code: string
        location: string
        max_capacity: string
    }
    setShelfData: (key: string, value: any) => void
    submitShelf: (e: React.FormEvent, shelfData?: any) => void
    shelfErrors: any
    processingShelf: boolean
    clearErrors: () => void
    existingLocations: string[]
}

export default function ShelfModal({
    open,
    onClose,
    shelfData,
    setShelfData,
    submitShelf,
    shelfErrors,
    processingShelf,
    clearErrors,
    existingLocations = [],
}: Props) {
    const [aisle, setAisle] = useState("")
    const [section, setSection] = useState("")

    useEffect(() => {
        if (!open) {
            setShelfData("code", "")
            setShelfData("location", "")
            setShelfData("max_capacity", "")
            setAisle("")
            setSection("")
            clearErrors()
        }
    }, [open, setShelfData, clearErrors])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validar código
        const codeRegex = /^SH-\d+$/
        if (!codeRegex.test(shelfData.code)) {
            Swal.fire({
                title: "Error",
                text: "El código debe tener el formato SH- seguido de números (Ej: SH-001)",
                icon: "error",
                confirmButtonColor: COLORS.primary,
            })
            return
        }

        // Validar pasillo
        if (!/^[A-Za-z]{1,3}$/.test(aisle.trim())) {
            Swal.fire({
                title: "Error",
                text: "El pasillo debe contener solo letras (máx. 3).",
                icon: "error",
                confirmButtonColor: COLORS.primary,
            })
            return
        }

        // Validar sección
        const sectionNum = Number.parseInt(section, 10)
        if (isNaN(sectionNum) || sectionNum < 1 || sectionNum > 100) {
            Swal.fire({
                title: "Error",
                text: "La sección debe ser un número entre 1 y 100.",
                icon: "error",
                confirmButtonColor: COLORS.primary,
            })
            return
        }

        // Armar ubicación completa
        const fullLocation = `Pasillo ${aisle.trim()}, Sección ${sectionNum}`

        // Validar ubicación única
        const isLocationTaken = existingLocations.some((loc) => loc.trim().toLowerCase() === fullLocation.toLowerCase())
        if (isLocationTaken) {
            Swal.fire({
                title: "Error",
                text: "Esta ubicación ya está registrada en el sistema",
                icon: "error",
                confirmButtonColor: COLORS.primary,
            })
            return
        }

        // Validar capacidad
        if (Number.parseFloat(shelfData.max_capacity) <= 0) {
            Swal.fire({
                title: "Error",
                text: "La capacidad debe ser mayor que cero",
                icon: "error",
                confirmButtonColor: COLORS.primary,
            })
            return
        }

        // Crear objeto con datos completos
        const completeShelfData = {
            code: shelfData.code.trim(),
            location: fullLocation,
            max_capacity: shelfData.max_capacity.trim(),
        }

        // Pasar los datos completos a submitShelf
        submitShelf(e, completeShelfData)
    }

    return (
        <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30" onClick={onClose} />

            <Dialog.Panel
                className="relative z-50 bg-white rounded-xl shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]"
                style={{ backgroundColor: COLORS.white }}
            >
                <div className="flex justify-between items-center mb-6 pb-3 border-b" style={{ borderColor: COLORS.secondary }}>
                    <Dialog.Title className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                        Registrar nueva estantería
                    </Dialog.Title>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={24} style={{ color: COLORS.primary }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label htmlFor="code" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                            Código
                        </Label>
                        <Input
                            id="code"
                            value={shelfData.code}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase()
                                setShelfData("code", value)
                            }}
                            className="w-full border rounded-md focus:ring-2 focus:ring-opacity-50"
                            style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            placeholder="Ej: SH-001"
                        />

                        <InputError message={shelfErrors.code} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="aisle" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                                Pasillo (solo letras, máx. 3)
                            </Label>
                            <Input
                                id="aisle"
                                value={aisle}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase()
                                    if (/^[A-Za-z]{0,3}$/.test(value)) {
                                        setAisle(value)
                                    }
                                }}
                                placeholder="Ej: A"
                                className="w-full border rounded-md"
                                style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            />
                        </div>

                        <div>
                            <Label htmlFor="section" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                                Sección (1 a 100)
                            </Label>
                            <Input
                                id="section"
                                type="number"
                                min="1"
                                max="100"
                                value={section}
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (/^\d{0,3}$/.test(value)) {
                                        setSection(value)
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (["-", "e", "E"].includes(e.key)) {
                                        e.preventDefault()
                                    }
                                }}
                                placeholder="Ej: 5"
                                className="w-full border rounded-md"
                                style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="max_capacity" className="block mb-1 font-medium" style={{ color: COLORS.black }}>
                            Capacidad Máxima
                        </Label>
                        <Input
                            id="max_capacity"
                            type="number"
                            min="1"
                            step="1"
                            value={shelfData.max_capacity}
                            onChange={(e) => {
                                const value = e.target.value
                                if (/^\d*$/.test(value)) {
                                    setShelfData("max_capacity", value)
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "-" || e.key === "e" || e.key === "E") {
                                    e.preventDefault()
                                }
                            }}
                            className="w-full border rounded-md focus:ring-2 focus:ring-opacity-50"
                            style={{ borderColor: COLORS.secondary, color: COLORS.black }}
                            placeholder="Ej: 100"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-5 mt-6 border-t" style={{ borderColor: COLORS.secondary }}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="px-4 py-2"
                            style={{
                                borderColor: COLORS.secondary,
                                color: COLORS.secondary,
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processingShelf}
                            className="px-4 py-2"
                            style={{
                                backgroundColor: COLORS.primary,
                                color: COLORS.white,
                                borderColor: COLORS.primary,
                            }}
                        >
                            {processingShelf ? "Procesando..." : "Crear estantería"}
                        </Button>
                    </div>
                </form>
            </Dialog.Panel>
        </Dialog>
    )
}
