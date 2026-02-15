-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_credential_id_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "credential_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_credential_id_fkey" FOREIGN KEY ("credential_id") REFERENCES "credential"("id") ON DELETE SET NULL ON UPDATE CASCADE;
