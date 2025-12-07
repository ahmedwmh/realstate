import React from "react";
import styles from "./hero.module.css";
import cn from "classnames";
import { Hero as HeroTitle } from "@/components/typography";
import { TeamMembers } from "@/constants/mock";
import TeamMember from "@/components/team-member";

export default function Hero() {
  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container")}>
        <div className={styles.content}>
          <HeroTitle size="hero-lg">Meet Our Agents</HeroTitle>
          <div className={cn("paragraph-medium", styles.subtitle)}>
            Our dedicated team of real estate professionals is here to help you
            find your perfect home in Al Hulool Al Muthla.
          </div>
        </div>

        <div className={styles.team_members}>
          {TeamMembers.map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
