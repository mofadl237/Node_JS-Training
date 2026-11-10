import { LoginForm } from "../LoginForm/LoginForm";
import { LoginHero } from "../LoginHero/LoginHero";
import styles from "./LoginScreen.module.scss";

export function LoginScreen() {
  return (
    <main className={styles.screen}>
      <div className={styles.shell}>
        <div className={styles.heroArea}>
          <LoginHero />
        </div>
        <div className={styles.formArea}>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
