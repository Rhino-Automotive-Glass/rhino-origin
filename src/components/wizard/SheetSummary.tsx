import type { OriginSheet } from "@/types/originSheet";

interface SheetSummaryProps {
  originSheet: OriginSheet;
}

export function SheetSummary({ originSheet }: SheetSummaryProps) {
  const espesoresArr = originSheet.Preparacion.espesores.filter((e) => e !== "otro");
  if (originSheet.Preparacion.espesorCustom) {
    espesoresArr.push(originSheet.Preparacion.espesorCustom);
  }
  const espesoresDisplay = espesoresArr.length > 0
    ? espesoresArr.map((e) => `${e} mm`).join(", ")
    : "—";

  const origenDisplay = originSheet.Preparacion.origen === "otro"
    ? originSheet.Preparacion.origenCustom || "—"
    : originSheet.Preparacion.origen
      ? originSheet.Preparacion.origen.charAt(0).toUpperCase() +
        originSheet.Preparacion.origen.slice(1)
      : "—";

  return (
    <div className="space-y-3">
      {/* Metadata */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="space-y-1">
          <div>Fecha: {originSheet.metadata.fechaFormateada}</div>
          <div>Creado Por: {originSheet.metadata.creadoPor}</div>
          <div>Verificado Por: {originSheet.metadata.verificadoPor || "—"}</div>
        </div>
      </div>

      {/* Información de Origen */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Información de Origen
        </div>
        <div className="mt-2 space-y-1">
          <div>Código Rhino: {originSheet.InformacionOrigen.rhinoCode || "—"}</div>
          <div>Descripción: {originSheet.InformacionOrigen.descripcion || "—"}</div>
          <div>Clave Externa: {originSheet.InformacionOrigen.claveExterna || "—"}</div>
        </div>
      </div>

      {/* Preparación */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Preparación
        </div>
        <div className="mt-2 space-y-1">
          <div>Espesores: {espesoresDisplay}</div>
          <div>Tolerancia: {originSheet.Preparacion.tolerancia || "—"}</div>
          <div>Origen: {origenDisplay}</div>
        </div>
      </div>

      {/* Diseño */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Diseño
        </div>
        <div className="mt-2">
          {originSheet.Diseno.archivos.length > 0 ? (
            <div className="space-y-1">
              {originSheet.Diseno.archivos.map((archivo) => (
                <div key={archivo.id}>
                  {archivo.nombre}{" "}
                  <span className="text-gray-400 dark:text-gray-500">
                    ({archivo.tipo})
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div>Sin archivos</div>
          )}
        </div>
      </div>

      {/* Corte */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Corte
        </div>
        <div className="mt-2 space-y-1">
          <div>Eje X: {originSheet.Corte.ejeX || "—"}</div>
          <div>Eje Y: {originSheet.Corte.ejeY || "—"}</div>
          <div>Área: {originSheet.Corte.area || "—"}</div>
        </div>
      </div>

      {/* Pulido */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Pulido
        </div>
        <div className="mt-2 space-y-1">
          <div>Metros lineales: {originSheet.Pulido.metrosLineales || "—"}</div>
          <div>Tipo de pulido: {originSheet.Pulido.tipoPulido || "—"}</div>
        </div>
      </div>

      {/* Barrenos */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Barrenos
        </div>
        <div className="mt-2">
          {originSheet.Barrenos.aplica ? (
            <div className="space-y-1">
              <div>Cantidad: {originSheet.Barrenos.cantidad}</div>
              {originSheet.Barrenos.barrenos.map((b) => (
                <div key={b.numero} className="ml-3">
                  Barreno {b.numero}: X {b.posicionX || "—"}, Y{" "}
                  {b.posicionY || "—"}, D {b.diametro || "—"} mm
                </div>
              ))}
            </div>
          ) : (
            <div>No aplica</div>
          )}
        </div>
      </div>

      {/* Marca */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Marca
        </div>
        <div className="mt-2 space-y-1">
          <div>Marca: {originSheet.Marca.marca || "—"}</div>
          <div>Color: {originSheet.Marca.colorMarca || "—"}</div>
          <div>Número Main: {originSheet.Marca.numeroMain || "—"}</div>
          <div>Coordenadas Main: {originSheet.Marca.coordenadasMain || "—"}</div>
        </div>
      </div>

      {/* Serigrafía */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Serigrafía
        </div>
        <div className="mt-2">
          {originSheet.Serigrafia.aplica ? (
            <div className="space-y-1">
              <div>Color: {originSheet.Serigrafia.color || "—"}</div>
              <div>
                Defroster:{" "}
                {originSheet.Serigrafia.defroster.aplica
                  ? `Aplica${
                      originSheet.Serigrafia.defroster.area
                        ? ` — Área: ${originSheet.Serigrafia.defroster.area}`
                        : ""
                    }`
                  : "No aplica"}
              </div>
            </div>
          ) : (
            <div>No aplica</div>
          )}
        </div>
      </div>

      {/* Templado */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Templado
        </div>
        <div className="mt-2 space-y-1">
          <div>Tipo de molde: {originSheet.Templado.tipoMolde || "—"}</div>
          <div>Tipo de proceso: {originSheet.Templado.tipoProceso || "—"}</div>
          <div>Radio cilindro: {originSheet.Templado.radioCilindro || "—"}</div>
        </div>
      </div>

      {/* Observaciones */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          Observaciones
        </div>
        <div className="mt-2 whitespace-pre-wrap">
          {originSheet.Observaciones.notas || "Sin observaciones"}
        </div>
      </div>
    </div>
  );
}
