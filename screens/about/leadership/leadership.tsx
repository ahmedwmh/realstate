import React from "react";
import styles from "./leadership.module.css";
import cn from "classnames";
import Image from "next/image";

const leadership = [
  {
    id: 1,
    title:
      "With over 25 years of experience in the real estate sector, Thomas Anderson leads Al Hulool Al Muthla with a focus on innovation and excellence.",
    avatar: "/images/team/thomas-anderson.webp",
    name: "Thomas Anderson",
    position: "CEO",
    description:
      "Thomas Anderson is a seasoned real estate professional with a proven track record of leadership and innovation.",
  },
  {
    id: 2,
    title:
      "Robert Harris brings extensive operational expertise to Al Hulool Al Muthla. As COO, he ensures smooth and efficient operations across all departments, focusing on enhacing productivity and client service.",
    avatar: "/images/team/robert-harris.webp",
    name: "Robert Harris",
    position: "COO",
    description:
      "Robert Harris is known for his exceptional operational management skills and strategic acumen.",
  },
];

export default function Leadership() {
  return (
    <section className={cn("section")}>
      <div className={cn("container")}>
        <div className={cn("subheading-small")}>LEADERSHIP TEAM</div>

        <div className={styles.leadership}>
          {leadership.map((leader) => (
            <div key={leader.id} className={styles.leader}>
              <div className={cn("heading-6", styles.title)}>
                {leader.title}
              </div>

              <div className={styles.leader_info}>
                <div className={styles.avatar_info}>
                  <div className={styles.avatar}>
                    <Image
                      src={leader.avatar}
                      alt={leader.avatar}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <div
                      className={cn("paragraph-x-large", styles.leader_name)}
                    >
                      {leader.name}
                    </div>
                    <div
                      className={cn("paragraph-medium", styles.leader_position)}
                    >
                      {leader.position}
                    </div>
                  </div>
                </div>
                <div
                  className={cn("paragraph-medium", styles.leader_description)}
                >
                  {leader.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
