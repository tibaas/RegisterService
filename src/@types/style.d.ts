import 'styled-components'
import  { defaultTheme }  from '../styles/themes/theme'

type ThemeType = typeof defaultTheme

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DefaultTheme extends ThemeType {}
}