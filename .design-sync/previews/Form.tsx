import { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "my-v0-project"

export const SolicitudCotizacion = () => {
  const form = useForm({
    defaultValues: {
      empresa: "Aceros del Norte, S.A.",
      correo: "logistica@acerosdelnorte.mx",
    },
  })

  return (
    <Form {...form}>
      <form className="w-80 space-y-6">
        <FormField
          control={form.control}
          name="empresa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Razón social del remitente.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo de contacto</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Solicitar cotización
        </Button>
      </form>
    </Form>
  )
}

export const ConError = () => {
  const form = useForm({
    defaultValues: { correo: "logistica@" },
  })

  useEffect(() => {
    form.setError("correo", {
      type: "manual",
      message: "Ingresa un correo electrónico válido.",
    })
  }, [form])

  return (
    <Form {...form}>
      <form className="w-80 space-y-6">
        <FormField
          control={form.control}
          name="correo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo de contacto</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Solicitar cotización
        </Button>
      </form>
    </Form>
  )
}
