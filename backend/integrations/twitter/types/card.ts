interface BindingValue {
  image_value: {
    width: number;
    height: number;
    url: string;
  };
  type: string;
}

interface BindingValues {
  photo_image_full_size_original?: BindingValue;
}

export interface TweetCard {
  binding_values?: BindingValues;
}
