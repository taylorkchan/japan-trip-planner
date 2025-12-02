-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "preferences" TEXT NOT NULL DEFAULT '{}',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "group_size" INTEGER NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "budget_range" TEXT NOT NULL,
    "trip_pace" TEXT NOT NULL,
    "preferences" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "attractions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "name_japanese" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "location_name" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "opening_hours" TEXT,
    "admission_fee" TEXT,
    "duration_minutes" INTEGER,
    "best_visit_time" TEXT,
    "accessibility_features" TEXT NOT NULL DEFAULT '{}',
    "seasonal_info" TEXT NOT NULL DEFAULT '{}',
    "cultural_significance" TEXT,
    "visitor_tips" TEXT,
    "photo_credits" TEXT NOT NULL DEFAULT '[]',
    "rating" DECIMAL,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "popularity_score" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "attraction_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attraction_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "alt_text" TEXT NOT NULL,
    "caption" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "photographer_credit" TEXT,
    "season" TEXT,
    "time_of_day" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attraction_images_attraction_id_fkey" FOREIGN KEY ("attraction_id") REFERENCES "attractions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trip_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trip_id" TEXT NOT NULL,
    "attraction_id" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "start_time" TEXT,
    "estimated_duration" INTEGER,
    "notes" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "custom_name" TEXT,
    "custom_description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "trip_activities_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "trip_activities_attraction_id_fkey" FOREIGN KEY ("attraction_id") REFERENCES "attractions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
