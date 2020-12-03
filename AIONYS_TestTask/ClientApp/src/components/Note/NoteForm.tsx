import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from '@material-ui/core';
import { useToasts } from "react-toast-notifications";

import { ApplicationState } from '../../store';
import * as NotesStore from '../../store/Notes'

const ValidateSchema = yup.object().shape({
    description: yup.string().required()
})

type FormType = {
    description: string
}

type PropsType = {
    currentId: number,
    setCurrentId: React.Dispatch<React.SetStateAction<number>>
}

export const NoteForm = (props: PropsType) => {

    const NotesData = useSelector<ApplicationState, NotesStore.NotesState>(state => state.Notes);
    const dispatch = useDispatch();

    const { handleSubmit, errors, register, reset, setValue } = useForm<FormType>({
        resolver: yupResolver(ValidateSchema)
    })

    const { addToast } = useToasts()

    const OnSubmit = (values: FormType) => {
        const onSuccess = () => {
            reset(); 
            props.setCurrentId(0)
            addToast("Submitted successfully", { appearance: 'success' })
        }
        if (props.currentId === 0){
            dispatch(NotesStore.Create(values, onSuccess));
        }
        else{
            dispatch(NotesStore.Update(props.currentId, values, onSuccess))
        }
    }

    React.useEffect(() => {
        if (props.currentId !== 0) {
            const currentNote = NotesData.Notes.find(x => x.id === props.currentId);
            setValue("description", currentNote ? currentNote.description : "")
        }
    }, [props.currentId])

    return (
        <form onSubmit={handleSubmit(OnSubmit)}>
            <h1>Note</h1>
            <div>
                <label>Note description</label>
                <input name="description" ref={register}></input>
                {errors.description && <p>This field is required</p>}
            </div>
            <div>
                <Button type="submit" color="primary" variant="contained"
                >Submit</Button>
                <Button
                    variant="contained"
                    onClick={() => { reset(); props.setCurrentId(0) }}
                >Reset</Button>
            </div>
        </form>)
}

export default NoteForm;