// BUILDER PATTERN
export class ActionDirector
{
    async perform(logicBuilder) {
        logicBuilder.initOutputJSON();
        await logicBuilder.populateTargetsLabelsAndJsonKeys();
        await logicBuilder.iterate();
    }
}

