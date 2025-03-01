<div className="flex items-center space-x-2 mb-4">
  <SavePropertyButton propertyId={property.id} variant="outline" />
  <span className="text-sm text-gray-500">
    {isSaved ? "Saved to your profile" : "Save this property"}
  </span>
</div> 