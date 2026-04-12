import type { HelpArticleSection } from "@/lib/help-centre-articles";

export function HelpArticleBody({ sections }: { sections: HelpArticleSection[] }) {
  return (
    <>
      {sections.map((sec, i) => (
        <section key={i}>
          {sec.heading ? <h2>{sec.heading}</h2> : null}
          {sec.paragraphs?.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
          {sec.steps && sec.steps.length > 0 ? (
            <ol>
              {sec.steps.map((s, j) => (
                <li key={j}>{s}</li>
              ))}
            </ol>
          ) : null}
          {sec.bullets && sec.bullets.length > 0 ? (
            <ul>
              {sec.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </>
  );
}
