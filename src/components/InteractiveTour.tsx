"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useTranslations } from "next-intl";

export default function InteractiveTour() {
  const t = useTranslations("Tour");

  useEffect(() => {
    // Faqat Client-side da ishlaydi va oldin tugatilmagan bo'lishi kerak
    const hasCompletedTour = localStorage.getItem("tour_completed_v1");
    if (hasCompletedTour) return;

    // Elementlar to'liq yuklanishi uchun biroz kutamiz
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        allowClose: true,
        doneBtnText: t("done"),
        closeBtnText: t("close"),
        nextBtnText: t("next"),
        prevBtnText: t("prev"),
        steps: [
          {
            popover: {
              title: t("welcome_title"),
              description: t("welcome_desc"),
              side: "over",
              align: "center"
            }
          },
          {
            element: "#tour-snippets",
            popover: {
              title: t("snippets_title"),
              description: t("snippets_desc"),
              side: "bottom",
              align: "start"
            }
          },
          {
            element: "#tour-prompts",
            popover: {
              title: t("prompts_title"),
              description: t("prompts_desc"),
              side: "bottom",
              align: "start"
            }
          },
          {
            element: "#tour-profile",
            popover: {
              title: t("profile_title"),
              description: t("profile_desc"),
              side: "bottom",
              align: "end"
            }
          }
        ],
        onDestroyStarted: () => {
          localStorage.setItem("tour_completed_v1", "true");
          driverObj.destroy();
        },
      });

      driverObj.drive();
    }, 1500);

    return () => clearTimeout(timer);
  }, [t]);

  return null;
}
