import { ImageUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../components/Button.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SectionCard from '../../components/SectionCard.jsx'
import { salesApi } from '../../services/api.js'

export default function UploadPhotoPage() {
  const navigate = useNavigate()
  const { customerId } = useParams()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (!file) {
      setPreview('')
      return undefined
    }

    const nextPreview = URL.createObjectURL(file)
    setPreview(nextPreview)

    return () => {
      URL.revokeObjectURL(nextPreview)
    }
  }, [file])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      toast.error('Select an image first.')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)
      await salesApi.uploadPhoto(customerId, formData)
      toast.success('Visit photo uploaded successfully.')
      navigate('/sales/dashboard')
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Unable to upload the photo.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sales"
        title="Upload visit photo"
        description="Attach image proof from the customer visit. This upload is now tied directly to the assigned customer record."
      />

      <SectionCard title="Visit photo">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-cyan-300/30 bg-cyan-300/6 px-6 py-12 text-center">
            <ImageUp className="text-cyan-300" size={28} />
            <p className="mt-4 text-base font-semibold text-white">Choose a visit image</p>
            <p className="mt-2 text-sm text-slate-300">PNG and JPG files work best for evidence capture.</p>
            <input className="hidden" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>

          {preview && <img src={preview} alt="Preview" className="h-72 w-full rounded-[28px] object-cover" />}

          <Button type="submit" className="w-full" loading={uploading}>
            Upload photo
          </Button>
        </form>
      </SectionCard>
    </div>
  )
}
