from django import forms

class CodeForm(forms.Form):
    code = forms.CharField(max_length=6)