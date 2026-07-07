import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  Label,
} from "my-v0-project"

export const CodigoVerificacion = () => (
  <div className="grid gap-2">
    <Label htmlFor="otp">Código de verificación</Label>
    <InputOTP id="otp" maxLength={6} value="482913" readOnly>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
    <p className="text-sm text-muted-foreground">
      Enviado por SMS al operador para confirmar la recolección.
    </p>
  </div>
)

export const CodigoParcial = () => (
  <div className="grid gap-2">
    <Label htmlFor="otp-parcial">Folio de entrega</Label>
    <InputOTP id="otp-parcial" maxLength={4} value="70" readOnly>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  </div>
)
