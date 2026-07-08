import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "my-v0-project"

export const CancelarEmbarque = () => (
  <div className="min-h-96">
    <AlertDialog open modal={false}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Cancelar el embarque MTY → Houston?
          </AlertDialogTitle>
          <AlertDialogDescription>
            La unidad ya está asignada y el operador confirmó salida a las 06:40
            h. Esta acción no se puede deshacer y podría generar cargos por
            falso flete.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Mantener embarque</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90">
            Sí, cancelar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
)
