export const bounceCartTarget = (): void => {
  const targets = document.querySelectorAll<HTMLElement>("[data-cart-target]");
  for (const target of targets) {
    if (target.getClientRects().length === 0) continue;
    target.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.25)" },
        { transform: "scale(0.95)" },
        { transform: "scale(1)" },
      ],
      { duration: 450, easing: "ease-out" },
    );
    break;
  }
};
