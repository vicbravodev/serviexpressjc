import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "my-v0-project"

export const ConsolaDespacho = () => (
  <div className="flex min-h-96 items-start justify-center p-6">
    <Menubar defaultValue="operaciones">
      <MenubarMenu value="operaciones">
        <MenubarTrigger>Operaciones</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Nuevo embarque <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Asignar unidad y operador</MenubarItem>
          <MenubarItem>Emitir carta porte</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Cerrar turno <MenubarShortcut>⌘⌥C</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="unidades">
        <MenubarTrigger>Unidades</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Ver flota disponible</MenubarItem>
          <MenubarItem>Programar mantenimiento</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="reportes">
        <MenubarTrigger>Reportes</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Embarques del día</MenubarItem>
          <MenubarItem>Rendimiento por ruta</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </div>
)
