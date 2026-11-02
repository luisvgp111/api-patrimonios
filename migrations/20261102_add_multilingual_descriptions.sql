-- Add optional translation fields without changing existing Patrimonio rows.
ALTER TABLE "Patrimonios"
  ADD COLUMN IF NOT EXISTS "descripcion_en" TEXT,
  ADD COLUMN IF NOT EXISTS "descripcion_indigena" TEXT,
  ADD COLUMN IF NOT EXISTS "idioma_indigena" VARCHAR(255);
