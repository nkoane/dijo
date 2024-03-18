/*
  Warnings:

  - A unique constraint covering the columns `[state]` on the table `OrderStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderStatus_state_key" ON "OrderStatus"("state");
