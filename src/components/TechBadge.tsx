import { getTechStyle } from "../utils/tech-colors";

interface TechBadgeProps {
  tech: string;
  size?: "sm" | "md" | "lg";
  onRemove?: () => void;
}

const SIZES = { sm: 28, md: 36, lg: 48 };

export function TechBadge({ tech, size = "md", onRemove }: TechBadgeProps) {
  const { bg, slug } = getTechStyle(tech);
  const px = SIZES[size];
  const iconPx = Math.round(px * 0.55);

  return (
    <div
      title={tech}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <div
        style={{
          width: px,
          height: px,
          borderRadius: "50%",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid rgba(255,255,255,0.25)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {slug ? (
          <img
            src={`https://cdn.simpleicons.org/${slug}/white`}
            alt={tech}
            width={iconPx}
            height={iconPx}
            style={{ objectFit: "contain", display: "block" }}
          />
        ) : (
          <span style={{ color: "#fff", fontSize: Math.round(iconPx * 0.7), fontWeight: 700, lineHeight: 1 }}>
            {tech.charAt(0).toUpperCase()}
          </span>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            title={`Remover ${tech}`}
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#e3350d",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 10,
              lineHeight: 1,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            ×
          </button>
        )}
      </div>

      {size !== "sm" && (
        <span
          style={{
            fontSize: 9,
            color: "#555",
            fontWeight: 600,
            textTransform: "capitalize",
            maxWidth: px + 8,
            textAlign: "center",
            lineHeight: 1.2,
            wordBreak: "break-word",
          }}
        >
          {tech}
        </span>
      )}
    </div>
  );
}
