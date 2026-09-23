import { AuthLayout } from '@rhino-automotive-glass/auth-ui'

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayout
      backgroundImage="/parabrisas-medallones-van-camioneta-autobuses.webp"
      backgroundAlt="Rhino Automotive Glass"
      title="Rhino Origin"
      subtitle="Sistema de Formatos de Origen"
    >
      {children}
    </AuthLayout>
  )
}
