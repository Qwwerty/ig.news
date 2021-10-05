import styles from './styles.module.scss'

import {SignInButton} from "../SignInButton";
import {ActiveLink} from "../ActiveLink";
import Link from "next/link";

export function Header () {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <img src="/images/logo.svg" alt="ig.news" />
        </Link>

        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Início</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Publicações</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}