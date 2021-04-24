import ptBR from 'date-fns/locale/pt-BR';
import format from 'date-fns/format'

import styles from './styles.module.scss';

export default function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  });
  return (
    <header className={styles.container}>
      <img src="/logo.svg" alt="Logo"/>

      <p>O melhor para voce ouvir sempre.</p>

      <span>{currentDate}</span>
    </header>
  )
}