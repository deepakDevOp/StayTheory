# Empty State Implementation Plan

Provide a beautiful, centered UI for empty data states across the platform to ensure the application feels polished even without data.

## User Review Required

> [!IMPORTANT]
> This change focuses on "Empty States" across both Admin and Public views. If no data exists, the user will see a curated illustration/icon and a call to action instead of a blank white screen.

## Proposed Changes

### Admin Dashboard Components

#### [MODIFY] [BookingTable.tsx](file:///c:/StayTheory/src/components/admin/BookingTable.tsx)
- Add a centered "No Booking Requests" state with a `Calendar` icon and a message.

#### [MODIFY] [PropertyGrid.tsx](file:///c:/StayTheory/src/components/admin/PropertyGrid.tsx)
- Add a centered "No Sanctuaries Found" state with a `Home` icon and a "Create New" CTA.

#### [MODIFY] [ReviewManager.tsx](file:///c:/StayTheory/src/components/admin/ReviewManager.tsx)
- Add a "No Guest Stories" state with a `MessageSquare` icon.

#### [MODIFY] [EditorGeneral.tsx](file:///c:/StayTheory/src/components/admin/editor/EditorGeneral.tsx)
- Add a "No Photos Uploaded" placeholder in the gallery view.

#### [MODIFY] [EditorAmenities.tsx](file:///c:/StayTheory/src/components/admin/editor/EditorAmenities.tsx)
- Add a message if no amenities are selected.

#### [MODIFY] [EditorRules.tsx](file:///c:/StayTheory/src/components/admin/editor/EditorRules.tsx)
- Add a message if no rules are defined.

---

### Public Site Components

#### [MODIFY] [PropertyCollection.tsx](file:///c:/StayTheory/src/components/PropertyCollection.tsx)
- Add a premium "Coming Soon" or "Finding Sanctuaries" state if the property list is empty.

#### [MODIFY] [PropertyDetails.tsx](file:///c:/StayTheory/src/pages/PropertyDetails.tsx)
- Handle missing reviews or missing amenities gracefully.

## Verification Plan

### Manual Verification
1.  **Admin Panel**: Clear the database (or just ensure it's empty) and verify each tab shows a beautiful centered empty state.
2.  **Public Site**: Verify the Home page and Journal show a "No Sanctuaries Found" state if the backend returns an empty list.
