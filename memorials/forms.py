from django import forms
from memorials.models import Memorial


class MemorialForm(forms.ModelForm):
    story = forms.CharField(widget=forms.Textarea, required=False)

    class Meta:
        model = Memorial
        fields = [
            'pet_name', 'species', 'breed',
            'birth_date', 'passing_date',
            'photo', 'epitaph', 'story', 'owner_name',
        ]
